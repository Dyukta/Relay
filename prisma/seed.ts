import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { hash } from "bcryptjs"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

const generateSecret = () => {
  const { randomBytes } = require("crypto")
  return `whsec_${randomBytes(32).toString("hex")}`
}

async function main() {
  console.log("Seeding database...")

  // Clean existing seed data
  await prisma.executionLog.deleteMany()
  await prisma.execution.deleteMany()
  await prisma.workflow.deleteMany()
  await prisma.apiKey.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user
  const passwordHash = await hash("demo123456", 12)

  const user = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "demo@relay.dev",
      passwordHash,
      workspace: {
        create: {
          signingSecret: generateSecret(),
        },
      },
    },
    include: { workspace: true },
  })

  const workspaceId = user.workspace!.id
  console.log(`Created user: ${user.email}`)

  // Create workflows
  const stripeWorkflow = await prisma.workflow.create({
    data: {
      workspaceId,
      name: "Stripe Payment Notifier",
      actionType: "SEND_EMAIL",
      actionConfig: {
        recipient: "billing@acme.co",
        subject: "New payment: {{event.type}}",
        template:
          "A new payment of {{event.amount}} {{event.currency}} was received.",
      },
      status: "ACTIVE",
    },
  })

  const githubWorkflow = await prisma.workflow.create({
    data: {
      workspaceId,
      name: "GitHub Issue → Linear Sync",
      actionType: "FORWARD_WEBHOOK",
      actionConfig: {
        url: "https://linear.app/webhook/inbound/github",
      },
      status: "ACTIVE",
    },
  })

  const shopifyWorkflow = await prisma.workflow.create({
    data: {
      workspaceId,
      name: "Shopify Order Forwarder",
      actionType: "FORWARD_WEBHOOK",
      actionConfig: {
        url: "https://fulfillment.acme.co/orders",
      },
      status: "ERROR",
    },
  })

  const slackWorkflow = await prisma.workflow.create({
    data: {
      workspaceId,
      name: "Internal Slack Alerts",
      actionType: "SEND_EMAIL",
      actionConfig: {
        recipient: "team@acme.co",
        subject: "Alert: {{event.type}}",
        template: "New alert received from {{event.source}}.",
      },
      status: "DISABLED",
    },
  })

  console.log("Created 4 workflows")

  // Helper to create execution with logs
  const createExecution = async (
    workflowId: string,
    status: string,
    durationMs: number,
    minutesAgo: number,
    logs: { level: string; message: string; offsetMs: number }[]
  ) => {
    const startedAt = new Date(Date.now() - minutesAgo * 60 * 1000)
    const completedAt =
      status === "SUCCESS" || status === "FAILED"
        ? new Date(startedAt.getTime() + durationMs)
        : null

    const execution = await prisma.execution.create({
      data: {
        workflowId,
        status: status as any,
        durationMs,
        payload: {
          type: "payment.succeeded",
          amount: 4900,
          currency: "usd",
          customer: "cus_demo123",
        },
        startedAt,
        completedAt,
      },
    })

    for (const log of logs) {
      await prisma.executionLog.create({
        data: {
          executionId: execution.id,
          level: log.level,
          message: log.message,
          timestamp: new Date(startedAt.getTime() + log.offsetMs),
        },
      })
    }

    return execution
  }

  // SUCCESS executions
  await createExecution(
    stripeWorkflow.id,
    "SUCCESS",
    389,
    0,
    [
      { level: "INFO", message: "Event received from 54.187.174.169", offsetMs: 0 },
      { level: "INFO", message: "Job queued for workflow: Stripe Payment Notifier", offsetMs: 17 },
      { level: "INFO", message: "Worker picked up job", offsetMs: 94 },
      { level: "INFO", message: "Sending email to billing@acme.co", offsetMs: 120 },
      { level: "SUCCESS", message: "Email delivered to billing@acme.co", offsetMs: 380 },
      { level: "SUCCESS", message: "Execution completed in 389ms", offsetMs: 389 },
    ]
  )

  await createExecution(
    githubWorkflow.id,
    "SUCCESS",
    498,
    9,
    [
      { level: "INFO", message: "Event received from 140.82.112.0", offsetMs: 0 },
      { level: "INFO", message: "Job queued for workflow: GitHub Issue → Linear Sync", offsetMs: 12 },
      { level: "INFO", message: "Worker picked up job", offsetMs: 88 },
      { level: "INFO", message: "Forwarding payload to https://linear.app/webhook/inbound/github", offsetMs: 100 },
      { level: "SUCCESS", message: "Payload forwarded — received 200", offsetMs: 490 },
      { level: "SUCCESS", message: "Execution completed in 498ms", offsetMs: 498 },
    ]
  )

  await createExecution(
    stripeWorkflow.id,
    "SUCCESS",
    116,
    24,
    [
      { level: "INFO", message: "Event received from 54.187.174.169", offsetMs: 0 },
      { level: "INFO", message: "Job queued for workflow: Stripe Payment Notifier", offsetMs: 10 },
      { level: "INFO", message: "Worker picked up job", offsetMs: 50 },
      { level: "INFO", message: "Sending email to billing@acme.co", offsetMs: 60 },
      { level: "SUCCESS", message: "Email delivered to billing@acme.co", offsetMs: 110 },
      { level: "SUCCESS", message: "Execution completed in 116ms", offsetMs: 116 },
    ]
  )

  await createExecution(
    slackWorkflow.id,
    "SUCCESS",
    196,
    13,
    [
      { level: "INFO", message: "Event received from 192.168.1.1", offsetMs: 0 },
      { level: "INFO", message: "Job queued for workflow: Internal Slack Alerts", offsetMs: 8 },
      { level: "INFO", message: "Worker picked up job", offsetMs: 40 },
      { level: "INFO", message: "Sending email to team@acme.co", offsetMs: 50 },
      { level: "SUCCESS", message: "Email delivered to team@acme.co", offsetMs: 190 },
      { level: "SUCCESS", message: "Execution completed in 196ms", offsetMs: 196 },
    ]
  )

  // FAILED executions
  await createExecution(
    shopifyWorkflow.id,
    "FAILED",
    266,
    35,
    [
      { level: "INFO", message: "Event received from 23.227.38.65", offsetMs: 0 },
      { level: "INFO", message: "Job queued for workflow: Shopify Order Forwarder", offsetMs: 15 },
      { level: "INFO", message: "Worker picked up job", offsetMs: 60 },
      { level: "INFO", message: "Forwarding payload to https://fulfillment.acme.co/orders", offsetMs: 80 },
      { level: "ERROR", message: "Target URL responded with 503: Service Unavailable", offsetMs: 260 },
      { level: "ERROR", message: "Execution failed: Target URL responded with 503", offsetMs: 266 },
    ]
  )

  await createExecution(
    stripeWorkflow.id,
    "FAILED",
    186,
    60,
    [
      { level: "INFO", message: "Event received from 54.187.174.169", offsetMs: 0 },
      { level: "INFO", message: "Job queued for workflow: Stripe Payment Notifier", offsetMs: 12 },
      { level: "INFO", message: "Worker picked up job", offsetMs: 55 },
      { level: "INFO", message: "Sending email to billing@acme.co", offsetMs: 70 },
      { level: "ERROR", message: "Resend error: Invalid API key", offsetMs: 180 },
      { level: "ERROR", message: "Execution failed: Resend error: Invalid API key", offsetMs: 186 },
    ]
  )

  // RETRYING execution
  await createExecution(
    shopifyWorkflow.id,
    "RETRYING",
    0,
    5,
    [
      { level: "INFO", message: "Event received from 23.227.38.65", offsetMs: 0 },
      { level: "INFO", message: "Job queued for workflow: Shopify Order Forwarder", offsetMs: 10 },
      { level: "INFO", message: "Worker picked up job", offsetMs: 45 },
      { level: "WARN", message: "Attempt 1 failed — retrying with backoff", offsetMs: 200 },
    ]
  )

  console.log("Created 7 executions with logs")
  console.log("\nSeed complete.")
  console.log("Demo credentials:")
  console.log("  Email: demo@relay.dev")
  console.log("  Password: demo123456")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })