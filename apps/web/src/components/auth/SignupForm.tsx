import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button"
import { FormField } from "./FormField"
import { PasswordField } from "./PasswordField"
import { PasswordStrengthMeter } from "./PasswordStrengthMeter"
import { OrDivider } from "./OrDivider"
import { GoogleSignInButton } from "./button/GoogleButton"

export function SignupForm() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    rePassword: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    rePassword: "",
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    setErrors({ ...errors, [name]: "" })
  }

  function validateForm() {
    const newErrors: typeof errors = {
      email: "",
      username: "",
      password: "",
      rePassword: "",
    }
    let isValid = true

    if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
      isValid = false
    }

    if (!validatePassword(form.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
      isValid = false
    }

    if (form.password !== form.rePassword) {
      newErrors.rePassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()

      if (!validateForm()) {
        setFormSubmitted(true)

        if (!validateForm()) {
          return
        }

        // TODO: Add your signup logic here
        // For example: call API to create user
        console.log("Form submitted:", form)

        // Show success message
        alert("Signup successful!")
      }

      function handleGoogleSignIn() {
        // Implement Google OAuth sign-in
        console.log("Signing in with Google...")
        // This would typically redirect to Google's OAuth flow
        // or use a library like next-auth, firebase auth, etc.
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-svh bg-gray-50 p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
              <p className="text-gray-600">
                Join us by filling out the form below
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full p-8 bg-white rounded-xl shadow-lg"
            >
              <FormField
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
              />

              <FormField
                id="username"
                name="username"
                type="text"
                label="Username"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="Choose a username"
                error={errors.username}
              />

              <div>
                <PasswordField
                  id="password"
                  name="password"
                  label="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  error={errors.password}
                />

                {form.password && (
                  <PasswordStrengthMeter password={form.password} />
                )}
              </div>

              <PasswordField
                id="rePassword"
                name="rePassword"
                label="Confirm Password"
                value={form.rePassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
                error={errors.rePassword}
              />

              <div className="mt-4 flex justify-center">
                <Button className="hover:cursor-pointer">Create Account</Button>
              </div>

              <OrDivider />

              <GoogleSignInButton onClick={handleGoogleSignIn} />
            </form>

            <div className="mt-6 text-center">
              <Link to="/login">
                <InteractiveHoverButton>
                  Already have an account? Login
                </InteractiveHoverButton>
              </Link>
            </div>
          </div>
        </div>
      )
    }
  }
}
