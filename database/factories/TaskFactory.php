<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    public function definition(): array
    {
        $statuses = ['pending', 'in_progress', 'completed'];
        $priorities = ['low', 'medium', 'high'];

        // Some realistic action verbs and topics
        $actions = [
            'Fix', 'Implement', 'Design', 'Review', 'Deploy',
            'Update', 'Test', 'Document', 'Optimize', 'Refactor',
            'Prepare', 'Research', 'Configure', 'Validate'
        ];

        $subjects = [
            'login module', 'API endpoint', 'dashboard UI', 'checkout flow',
            'payment gateway', 'email notifications', 'database migration',
            'staging build', 'user profile page', 'landing page',
            'data export feature', 'search functionality', 'unit tests',
            'performance optimization', 'cron job scheduler'
        ];

        // Randomly combine them into a title
        $title = $this->faker->randomElement($actions) . ' ' . $this->faker->randomElement($subjects);

        return [
            'title' => ucfirst($title),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement($statuses),
            'priority' => $this->faker->randomElement($priorities),
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+2 months'),
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'updated_at' => now(),
        ];
    }
}
