<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $statusOptions = [
            'pending' => 'Pending',
            'in_progress' => 'In Progress',
            'completed' => 'Completed',
        ];

        $priorityOptions = [
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
        ];

        return Inertia::render('Admin/Tasks/Index', [
            'datatableUrl'   => route('admin.tasks.datatable'),
            'statusOptions'  => $statusOptions,
            'priorityOptions'=> $priorityOptions,
        ]);
    }

    /**
     * Datatable JSON endpoint
     */
    public function datatableJson(Request $request)
    {
        [$items, $pagination] = $this->queryTasks($request);

        return response()->json([
            'data' => $items,
            'pagination' => $pagination,
        ]);
    }

    /**
     * Central query builder for reusable filtering and sorting
     */
    protected function queryTasks(Request $request): array
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $priority = $request->string('priority')->toString();
        $sortBy = $request->string('sort_by')->toString() ?: 'created_at';
        $sortDir = strtolower($request->string('sort_dir')->toString() ?: 'desc');
        $perPage = (int) $request->integer('per_page') ?: 10;

        $query = Task::query()
            ->when($search, fn($q) =>
                $q->where(function ($w) use ($search) {
                    $w->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
                })
            )
            ->when($status, fn($q) => 
                // Handle comma-separated status values
                str_contains($status, ',') 
                    ? $q->whereIn('status', explode(',', $status))
                    : $q->where('status', $status)
            )
            ->when($priority, fn($q) => 
                // Handle comma-separated priority values
                str_contains($priority, ',') 
                    ? $q->whereIn('priority', explode(',', $priority))
                    : $q->where('priority', $priority)
            );

        $sortable = ['title', 'status', 'priority', 'due_date', 'created_at'];
        if (!in_array($sortBy, $sortable)) {
            $sortBy = 'created_at';
        }
        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';

        $paginator = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        $items = $paginator->getCollection()->map(function (Task $task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority,
                'due_date' => $task->due_date?->toDateString(),
                'created_at' => $task->created_at?->toDateTimeString(),
            ];
        })->values();

        $pagination = [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
        ];

        return [$items, $pagination];
    }

    /**
     * Store a newly created task
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        Task::create($validated);

        return redirect()
            ->route('admin.tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Update the specified task
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'required|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified task
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->noContent();
    }

    /**
     * Bulk delete tasks
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tasks,id'
        ]);

        try {
            Task::whereIn('id', $request->ids)->delete();
            
            return response()->json([
                'message' => 'Tasks deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete tasks'
            ], 500);
        }
    }

    /**
     * Export tasks
     */
    public function export(Request $request)
    {
        $request->validate([
            'ids' => 'sometimes|array',
            'ids.*' => 'exists:tasks,id'
        ]);

        $tasks = Task::when($request->has('ids'), function ($query) use ($request) {
            $query->whereIn('id', $request->ids);
        })->get();

        $fileName = 'tasks-' . now()->format('Y-m-d') . '.csv';
        
        return response()->streamDownload(function () use ($tasks) {
            $handle = fopen('php://output', 'w');
            
            // Add CSV headers
            fputcsv($handle, ['ID', 'Title', 'Status', 'Priority', 'Due Date', 'Created At']);
            
            // Add data
            foreach ($tasks as $task) {
                fputcsv($handle, [
                    $task->id,
                    $task->title,
                    $task->status,
                    $task->priority,
                    $task->due_date?->toDateString(),
                    $task->created_at?->toDateTimeString(),
                ]);
            }
            
            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
