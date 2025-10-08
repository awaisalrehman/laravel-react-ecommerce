import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StatusOption {
  value: string
  label: string
  color: string
}

interface StatusSelectProps {
  statuses: StatusOption[]
  value: string
  onChange: (value: string) => void
}

export default function StatusSelect({ statuses, value, onChange }: StatusSelectProps) {
  const selected = statuses.find((s) => s.value === value)

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select status">
          {selected && (
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${selected.color}`} />
              {selected.label}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status.color}`} />
              {status.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
