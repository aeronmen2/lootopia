import { useState, ChangeEvent } from "react"
import { Eye, EyeOff } from "lucide-react"
import { FormField } from "./FormField"

interface PasswordFieldProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
  error?: string
}

export function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  error,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormField
      id={id}
      name={name}
      type={showPassword ? "text" : "password"}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      error={error}
      className="pr-10"
    >
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </FormField>
  )
}
