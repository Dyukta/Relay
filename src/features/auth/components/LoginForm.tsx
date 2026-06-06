// src/features/auth/components/LoginForm.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { loginSchema, type LoginInput } from "@/features/auth/schemas/loginSchema"

interface FieldErrors {
  email?: string
  password?: string
}

export const LoginForm = () => {
  const router = useRouter()

  const [values, setValues] = useState<LoginInput>({
    email: "",
    password: ""
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

    const parsed = loginSchema.safeParse(values)

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
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false
      })

      if (result?.error) {
        setServerError("Invalid email or password")
        return
      }

      router.push("/app/dashboard")
      router.refresh()
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
            Sign in to Relay
          </h1>
          <p className="text-[#666] text-sm mb-6">Continue to your workspace.</p>

          {serverError && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{serverError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#999] mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                value={values.email}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#999] mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••••••"
                value={values.password}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg py-2.5 transition-colors mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-[#666] mt-4">
          New to Relay?{" "}
          <Link
            href="/register"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}