import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "@tanstack/react-router"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { ErrorAlert } from "./ErrorAlert"
import { IconFormField } from "./IconFormField"
import { Checkbox } from "./Checkbox"
import { OrDivider } from "./OrDivider"
import { GoogleSignInButton } from "./button/GoogleButton"
import { PasswordFieldWithIcon } from "./PasswordFieldWithIcon"
import { useAuth } from "@/hooks/useAuth"

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: "", general: "" })
  }

  function validateForm() {
    const newErrors: typeof errors = { email: "", password: "", general: "" }
    let isValid = true

    if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    if (form.password.length < 1) {
      newErrors.password = "Please enter your password"
      isValid = false
    }

    setErrors({ ...newErrors, general: "" })
    return isValid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await login({
        email: form.email,
        password: form.password,
      })
      navigate({ to: "/dashboard" }) // Change route as needed
    } catch (error: any) {
      setErrors({
        ...errors,
        general:
          error?.message || "Invalid email or password. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleGoogleSignIn() {
    // Implement Google OAuth sign-in
    console.log("Signing in with Google...")
  }

  const forgotPasswordLink = (
    <a
      href="/forgot-password"
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      Forgot password?
    </a>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">lootopia</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        <ErrorAlert message={errors.general} />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full p-8 bg-white rounded-xl shadow-lg"
        >
          <IconFormField
            id="email"
            name="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="your.email@example.com"
            error={errors.email}
            icon={<Mail size={18} />}
          />

          <PasswordFieldWithIcon
            id="password"
            name="password"
            label="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password}
            icon={<Lock size={18} />}
            labelRight={forgotPasswordLink}
          />

          <Checkbox id="remember-me" name="remember-me" label="Remember me" />

          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? "Signing in..." : "Sign in"}
            {!isLoading && <ArrowRight size={16} />}
          </Button>

          <OrDivider />

          <GoogleSignInButton onClick={handleGoogleSignIn} />
        </form>

        <div className="mt-6 text-center">
          <Link to="/signup" className="text-sm text-gray-600">
            <InteractiveHoverButton>
              Don't have an account? Create one
            </InteractiveHoverButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
