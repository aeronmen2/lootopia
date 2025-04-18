import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChangeEvent, ReactNode } from "react"

interface IconFormFieldProps {
  id: string
  name: string
  type: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
  error?: string
  icon?: ReactNode
  rightElement?: ReactNode
  className?: string
  labelRight?: ReactNode
}

export function IconFormField({
  id,
  name,
  type,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  error,
  icon,
  rightElement,
  className = "",
  labelRight,
}: IconFormFieldProps & {
  rightElement?: ReactNode
  className?: string
  labelRight?: ReactNode
  label?: string
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <Label htmlFor={id} className="block">
          {label}
        </Label>
        {labelRight}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`${icon ? "pl-10" : ""} ${rightElement ? "pr-10" : ""} ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
