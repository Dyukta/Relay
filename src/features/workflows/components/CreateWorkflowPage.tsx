"use client"

import { useState } from "react"
import Link from "next/link"
import { useCreateWorkflow } from "@/features/workflows/hooks/useCreateWorkflow"
import { createWorkflowSchema } from "@/features/workflows/schemas/workflowSchema"
import { generateEndpointUrl } from "@/features/workflows/utils/generateEndpointUrl"
import { CopyButton } from "@/shared/components/CopyButton"

type ActionType = "SEND_EMAIL" | "FORWARD_WEBHOOK"

interface FormState {
  name: string
  actionType: ActionType
  recipient: string
  subject: string
  template: string
  forwardUrl: string
}

export const CreateWorkflowPage = () => {
  const { create, loading, error } = useCreateWorkflow()

  const [form, setForm] = useState<FormState>({
    name: "",
    actionType: "SEND_EMAIL",
    recipient: "",
    subject: "",
    template: "",
    forwardUrl: ""
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const previewWebhookId = "wf_preview"
  const previewUrl = generateEndpointUrl(previewWebhookId)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async () => {
    const actionConfig =
      form.actionType === "SEND_EMAIL"
        ? {
            recipient: form.recipient,
            subject: form.subject,
            template: form.template,
          }
        : { url: form.forwardUrl }

    const input = {
      name: form.name,
      actionType: form.actionType,
      actionConfig,
    }

    const parsed = createWorkflowSchema.safeParse(input)

    if (!parsed.success) {
      const errors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[issue.path.length - 1] as string
        errors[field] = issue.message
      })
      setFieldErrors(errors)
      return
    }

    await create(parsed.data)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/app/workflows"
          className="text-[#555] hover:text-white text-sm transition-colors"
        >
          ← Back to workflows
        </Link>
      </div>

      <h1 className="text-white text-xl font-semibold mb-1">
        Create workflow
      </h1>
      <p className="text-[#555] text-sm mb-8">
        Configure a trigger and action. You can edit everything after creation.
      </p>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-medium">
              1
            </span>
            <p className="text-white text-sm font-medium">
              Workflow Information
            </p>
          </div>

          <div>
            <label className="block text-xs text-[#666] mb-1.5">
              Workflow Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Stripe Payment Notifier"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>
            )}
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-medium">
              2
            </span>
            <p className="text-white text-sm font-medium">Trigger</p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg mb-3">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-indigo-400"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <p className="text-indigo-300 text-sm font-medium">Webhook</p>
            <span className="ml-auto text-xs text-[#555]">Default</span>
          </div>

          <div>
            <p className="text-xs text-[#555] mb-1.5">
              Generated endpoint preview
            </p>
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2">
              <code className="text-[#666] text-xs flex-1 truncate">
                {previewUrl}
              </code>
              <CopyButton value={previewUrl} />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-medium">
              3
            </span>
            <p className="text-white text-sm font-medium">Action</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                setForm((prev) => ({ ...prev, actionType: "SEND_EMAIL" }))
              }
              className={`p-3 rounded-lg border text-left transition-colors ${
                form.actionType === "SEND_EMAIL"
                  ? "border-indigo-500/50 bg-indigo-500/10"
                  : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a]"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  form.actionType === "SEND_EMAIL"
                    ? "text-indigo-300"
                    : "text-white"
                }`}
              >
                Send Email
              </p>
              <p className="text-xs text-[#555] mt-0.5">
                Send a templated email via Resend.
              </p>
            </button>

            <button
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  actionType: "FORWARD_WEBHOOK",
                }))
              }
              className={`p-3 rounded-lg border text-left transition-colors ${
                form.actionType === "FORWARD_WEBHOOK"
                  ? "border-indigo-500/50 bg-indigo-500/10"
                  : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a]"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  form.actionType === "FORWARD_WEBHOOK"
                    ? "text-indigo-300"
                    : "text-white"
                }`}
              >
                Forward Webhook
              </p>
              <p className="text-xs text-[#555] mt-0.5">
                Forward the payload to an external URL.
              </p>
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-medium">
              4
            </span>
            <p className="text-white text-sm font-medium">Configuration</p>
          </div>

          {form.actionType === "SEND_EMAIL" ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#666] mb-1.5">
                  Recipient
                </label>
                <input
                  name="recipient"
                  type="email"
                  placeholder="alerts@company.com"
                  value={form.recipient}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {fieldErrors.recipient && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.recipient}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-[#666] mb-1.5">
                  Subject
                </label>
                <input
                  name="subject"
                  type="text"
                  placeholder="New event: {{event.type}}"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {fieldErrors.subject && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-[#666] mb-1.5">
                  Message Template
                </label>
                <textarea
                  name="template"
                  placeholder="Hi team — a new {{event.type}} arrived from {{event.source}}…"
                  value={form.template}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
                {fieldErrors.template && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.template}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs text-[#666] mb-1.5">
                Target URL
              </label>
              <input
                name="forwardUrl"
                type="text"
                placeholder="https://your-service.com/webhook"
                value={form.forwardUrl}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
              />
              {fieldErrors.url && (
                <p className="mt-1 text-xs text-red-400">{fieldErrors.url}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/app/workflows"
            className="text-sm text-[#555] hover:text-white transition-colors px-4 py-2"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? "Saving..." : "Save Workflow"}
          </button>
        </div>
      </div>
    </div>
  )
}