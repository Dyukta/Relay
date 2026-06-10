import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { hash } from "bcryptjs"
import { randomBytes } from "crypto"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

const generateSecret = () => {
  return `whsec_${randomBytes(32).toString("hex")}`
}

async function main() {
  console.log("Seeding database...")

  await prisma.executionLog.deleteMany()
  await prisma.execution.deleteMany()
  await prisma.workflow.deleteMany()
  await prisma.apiKey.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.user.deleteMany()

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
  console.log(`User created: ${user.email}`)

  const stripeWorkflow = await prisma.workflow.create({
    data: {
      workspaceId,
      name: "Stripe Payment Notifier",
      actionType: "SEND_EMAIL",
      actionConfig: {
        recipient: "billing@acme.co",
        subject: "New payment: {{event.type}}",
        template: "Payment of {{event.amount}} {{event.currency}} received.",
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
        template: "Alert received from {{event.source}}",
      },
      status: "DISABLED",
    },
  })

  console.log("Workflows created")

  const createExecution = async (
    workflowId: string,
    status: string,
    durationMs: number,
    minutesAgo: number,
    logs: { level: string; message: string; offsetMs: number }[]
  ) => {
    const startedAt = new Date(Date.now() - minutesAgo * 60000)

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
          timestamp: new Date(startedAt.getTime() + log.offsetMs)
        }
      })
    }

    return execution
  }

  await createExecution(stripeWorkflow.id, "SUCCESS", 389, 0, [
    { level: "INFO", message: "Webhook received (54.187.174.169)", offsetMs: 0 },
    { level: "INFO", message: "Queued for Stripe Payment Notifier", offsetMs: 17 },
    { level: "INFO", message: "Worker picked up job", offsetMs: 94 },
    { level: "INFO", message: "Sending email → billing@acme.co", offsetMs: 120 },
    { level: "SUCCESS", message: "Delivered to billing@acme.co", offsetMs: 380 }
  ])

  await createExecution(githubWorkflow.id, "SUCCESS", 498, 9, [
    { level: "INFO", message: "Webhook received (140.82.112.0)", offsetMs: 0 },
    { level: "INFO", message: "Queued for GitHub → Linear sync", offsetMs: 12 },
    { level: "INFO", message: "Worker started processing", offsetMs: 88 },
    { level: "INFO", message: "Forwarding to Linear webhook", offsetMs: 100 },
    { level: "SUCCESS", message: "Linear responded 200 OK", offsetMs: 490 }
  ])

  await createExecution(shopifyWorkflow.id, "FAILED", 266, 35, [
    { level: "INFO", message: "Webhook received (23.227.38.65)", offsetMs: 0 },
    { level: "INFO", message: "Queued for Shopify order forwarding", offsetMs: 15 },
    { level: "INFO", message: "Worker started", offsetMs: 60 },
    { level: "INFO", message: "Sending to fulfillment service", offsetMs: 80 },
    { level: "ERROR", message: "503 Service Unavailable", offsetMs: 260 }
  ])

  await createExecution(stripeWorkflow.id, "FAILED", 186, 60, [
    { level: "INFO", message: "Webhook received (54.187.174.169)", offsetMs: 0 },
    { level: "INFO", message: "Queued for Stripe Payment Notifier", offsetMs: 12 },
    { level: "INFO", message: "Worker picked up job", offsetMs: 55 },
    { level: "ERROR", message: "Invalid API key (Resend)", offsetMs: 180 }
  ])

  await createExecution(shopifyWorkflow.id, "RETRYING", 0, 5, [
    { level: "INFO", message: "Webhook received (23.227.38.65)", offsetMs: 0 },
    { level: "INFO", message: "Job queued", offsetMs: 10 },
    { level: "WARN", message: "Retry scheduled after failure", offsetMs: 200 }
  ])

  console.log("Executions created")
  console.log("Seed complete")
  console.log("demo@relay.dev / demo123456")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })