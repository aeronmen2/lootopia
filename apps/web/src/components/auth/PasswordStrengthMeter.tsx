import { CheckCircle, XCircle } from "lucide-react"

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasMinLength = password.length >= 8

  const strength = [
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasMinLength,
  ].filter(Boolean).length

  let strengthLabel = ""
  let strengthColor = ""

  switch (strength) {
    case 4:
      strengthLabel = "Very Strong"
      strengthColor = "bg-green-500"
      break
    case 3:
      strengthLabel = "Strong"
      strengthColor = "bg-blue-500"
      break
    case 2:
      strengthLabel = "Medium"
      strengthColor = "bg-yellow-500"
      break
    default:
      strengthLabel = "Weak"
      strengthColor = "bg-red-500"
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${strengthColor}`}
            style={{ width: `${strength * 25}%` }}
          ></div>
        </div>
        <span className="text-xs whitespace-nowrap">{strengthLabel}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <PasswordRequirement met={hasUppercase} label="Uppercase" />
        <PasswordRequirement met={hasLowercase} label="Lowercase" />
        <PasswordRequirement met={hasNumbers} label="Number" />
        <PasswordRequirement met={hasMinLength} label="8+ characters" />
      </div>
    </div>
  )
}

function PasswordRequirement({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {met ? (
        <CheckCircle size={12} className="text-green-500" />
      ) : (
        <XCircle size={12} className="text-gray-400" />
      )}
      <span>{label}</span>
    </div>
  )
}
