"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerSchema, type RegisterInput } from "@/features/auth/schemas/registerSchema"

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export const RegisterForm = () => {
  const router = useRouter()

  const [values, setValues] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError("")
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const parsed = registerSchema.safeParse(values)

    if (!parsed.success) {
      const errors: FieldErrors = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors
        errors[field] = issue.message
      })
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    setServerError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      })

      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong")
        return
      }

      router.push("/app/dashboard")
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="text-white text-lg font-semibold">Relay</span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-8">
          <h1 className="text-white text-xl font-semibold mb-1">
            Create your account
          </h1>

          {serverError && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{serverError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#999] mb-1.5">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                value={values.name}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#999] mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#999] mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                value={values.password}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#999] mb-1.5">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={values.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg py-2.5 transition-colors mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-[#666] mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}