import { useState, ReactNode, ChangeEvent } from "react"
import { Eye, EyeOff } from "lucide-react"
import { IconFormField } from "./IconFormField"

interface PasswordFieldWithIconProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
  error?: string
  icon?: ReactNode
  labelRight?: ReactNode
}

export function PasswordFieldWithIcon({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  error,
  icon,
  labelRight,
}: PasswordFieldWithIconProps) {
  const [showPassword, setShowPassword] = useState(false)

  const toggleButton = (
    <button
      type="button"
      className="text-gray-400 hover:text-gray-600"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  )

  return (
    <IconFormField
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
      icon={icon}
      rightElement={toggleButton}
      labelRight={labelRight}
    />
  )
}
