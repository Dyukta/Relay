"use client"

import Link from "next/link"
import { Activity, ArrowRight, Shield, Workflow, type LucideIcon } from "lucide-react"

const containerClass = "mx-auto max-w-6xl px-6"

const featureCardClass =
  "rounded-2xl border border-neutral-200 bg-neutral-50 p-7 transition-colors hover:border-indigo-300 hover:bg-indigo-50/30"

const executions = [
  {
    time: "16:42:11.024",
    level: "INFO",
    message: "Event received from 54.187.174.169",
  },
  {
    time: "16:42:11.041",
    level: "INFO",
    message: "Job queued in workers.default",
  },
  {
    time: "16:42:11.118",
    level: "INFO",
    message: "Worker w-04 picked up job ej_8a72d",
  },
  {
    time: "16:42:11.201",
    level: "INFO",
    message: "Sending email to billing@acme.co",
  },
  {
    time: "16:42:11.308",
    level: "SUCCESS",
    message: "Email delivered to billing@acme.co",
  },
  {
    time: "16:42:11.312",
    level: "SUCCESS",
    message: "Execution completed in 288ms",
  }
] as const

const features = [
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Trigger workflows from webhooks and connect actions across your stack."
  },
  {
    icon: Activity,
    title: "Execution Tracking",
    description:
      "Inspect every run with logs, payloads, durations and status history."
  },
  {
    icon: Shield,
    title: "Built-in Security",
    description:
      "Verify requests with signatures, API keys and authenticated sessions."
  },
] satisfies {
  icon: LucideIcon
  title: string
  description: string
}[]

function Header() {
  return (
    <header className="border-b border-neutral-200">
      <div
        className={`${containerClass} flex h-14 items-center justify-between`}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold text-white">
            R
          </div>

          <span className="text-sm font-medium">Relay</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="py-20">
      <div className={containerClass}>
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h1 className="max-w-[10ch] text-5xl leading-[0.92] tracking-tight sm:text-6xl lg:text-[4rem]">
              Turn events into actions.
              <span className="block text-indigo-500">
                Track every execution.
              </span>
            </h1>
          </div>

          <div className="flex flex-col justify-center lg:pt-8">
            <p className="max-w-md text-lg leading-relaxed text-neutral-500">
              Trigger workflows from webhooks and monitor every execution from a
              single dashboard.
            </p>

            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
              >
                Get Started
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <ExecutionPreview />
        </div>
      </div>
    </section>
  )
}

function ExecutionPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-xl">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          <div className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
        </div>

        <span className="font-mono text-[10px] text-neutral-500">
          Execution #a8f3b21
        </span>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          <span className="font-mono text-[10px] text-green-400">
            SUCCESS
          </span>
        </div>
      </div>

      <div className="px-4 py-3">
        {executions.map((execution) => (
          <ExecutionRow
            key={`${execution.time}-${execution.message}`}
            execution={execution}
          />
        ))}
      </div>
    </div>
  )
}

function ExecutionRow({
  execution,
}: {
  execution: (typeof executions)[number]
}) {
  const isSuccess = execution.level === "SUCCESS"

  return (
    <div className="flex items-start gap-3 border-b border-neutral-800/50 py-2 last:border-0">
      <span className="shrink-0 font-mono text-[10px] text-neutral-600">
        {execution.time}
      </span>

      <span
        className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] ${
          isSuccess
            ? "bg-green-500/10 text-green-400"
            : "bg-indigo-500/10 text-indigo-400"
        }`}
      >
        {execution.level}
      </span>

      <span className="font-mono text-[10px] text-neutral-400">
        {execution.message}
      </span>
    </div>
  )
}

function FeaturesSection() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className={containerClass}>
        <div className="mb-12 text-center">
          <h2 className="text-4xl tracking-tight">
            Everything needed to run workflows
          </h2>

          <p className="mt-4 text-neutral-500">
            Built for reliability, visibility and security.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className={featureCardClass}>
      <Icon className="mb-4 h-5 w-5 text-indigo-500" />

      <h3 className="mb-2 text-sm font-medium">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-neutral-500">
        {description}
      </p>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-8">
      <div
        className={`${containerClass} flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500">
            <span className="font-mono text-[9px] font-medium text-white">
              R
            </span>
          </div>

          <span className="font-mono text-[11px] text-neutral-400">
            © 2026 Relay
          </span>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
