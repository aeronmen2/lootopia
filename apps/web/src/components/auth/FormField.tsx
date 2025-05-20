import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChangeEvent, ReactNode } from "react"

interface FormFieldProps {
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
  children?: ReactNode
  className?: string
}

export function FormField({
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
  children,
  className = "",
}: FormFieldProps & {
  children?: ReactNode
  className?: string
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1 block">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
        />
        {children}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
