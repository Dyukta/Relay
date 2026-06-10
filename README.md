# Relay

**Workflow execution and monitoring for developers.**

Relay is a production-grade event-driven workflow platform. Point any external service at a generated webhook endpoint, and Relay receives the event, queues a job, executes an action, and gives you full observability into every execution — logs, payloads, durations, and status — in real time.

---

## What it does

When an external service (Stripe, GitHub, Shopify, or anything else) sends a POST request to a Relay webhook endpoint:

1. The request is verified using HMAC-SHA256 signature validation
2. An execution record is created immediately and returned with a `202 Accepted`
3. The job is processed asynchronously — either sending a templated email or forwarding the payload to another URL
4. Every step is logged with a timestamp, level, and message
5. The result is visible on the dashboard, executions list, and execution detail page in real time

---

## Architecture

```
External Service (Stripe, GitHub, etc.)
        │
        ▼
POST /api/webhooks/:webhookId
        │
        ├── Verify HMAC-SHA256 signature
        ├── Create execution record (PENDING → QUEUED)
        └── Process job asynchronously
                │
                ├── Update status: RUNNING
                ├── Execute action:
                │       ├── SEND_EMAIL → Resend API
                │       └── FORWARD_WEBHOOK → fetch() to target URL
                ├── Append structured logs (INFO / SUCCESS / ERROR)
                └── Update status: SUCCESS | FAILED
```

The frontend reads execution data directly from PostgreSQL via Prisma. There is no polling — the user refreshes to see updated state, which is realistic for a developer tool at this scale.

---

## Engineering highlights

### HMAC-SHA256 webhook verification

Every workspace has a unique signing secret generated on registration. Incoming webhook requests include an `X-Relay-Signature` header. The server computes the expected signature and compares using `timingSafeEqual` from Node's built-in `crypto` module — preventing timing attacks.

```ts
export const verifySignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const expected = signPayload(payload, secret)
  const expectedBuffer = Buffer.from(expected, "hex")
  const receivedBuffer = Buffer.from(signature, "hex")
  if (expectedBuffer.length !== receivedBuffer.length) return false
  return timingSafeEqual(expectedBuffer, receivedBuffer)
}
```

### Feature-first architecture

Every domain is self-contained under `src/features/`. Each feature owns its components, hooks, services, schemas, and types. Nothing leaks between features except shared utilities.

```
src/features/
  auth/         components, services, schemas
  dashboard/    components, hooks, services, types
  workflows/    components, hooks, services, schemas, types, utils
  executions/   components, hooks, services, types
  settings/     components, hooks, services, schemas
```

### Strict layer separation

- API routes call services only — never Prisma directly
- Services call Prisma only — never HTTP
- Components call hooks only — never fetch directly
- Hooks call the API layer — no business logic

### One file, one responsibility

Every file in the codebase has a single job. `workflowService.ts` contains only Prisma queries for workflows. `useWorkflows.ts` contains only the client-side data fetching hook. `generateEndpointUrl.ts` contains only the URL builder. This is enforced throughout — no file exceeds 150 lines.

### Structured execution logging

Every step of a job appends a log entry to the database with a level (`INFO`, `SUCCESS`, `ERROR`, `WARN`) and a precise timestamp. The execution detail page renders the full timeline — identical to how tools like Zapier and Trigger.dev work internally.

```
11:13:12.993  INFO     Event received from 54.187.174.169
11:13:13.010  INFO     Job queued for workflow: Stripe Payment Notifier
11:13:13.087  INFO     Worker picked up job
11:13:13.113  INFO     Sending email to billing@acme.co
11:13:13.373  SUCCESS  Email delivered to billing@acme.co
11:13:13.382  SUCCESS  Execution completed in 389ms
```

### Template interpolation engine

Action configs support `{{variable}}` syntax for dynamic content. The worker interpolates templates using the incoming event payload before executing the action.

```ts
// Subject: "New payment: {{event.type}}"
// Payload: { event: { type: "payment.succeeded" } }
// Result:  "New payment: payment.succeeded"
```

### API key system

API keys are generated with a cryptographically secure random value, stored only as a bcrypt hash, and shown to the user exactly once. The UI displays a masked preview (`ak_live_8f12...8821`) for identification without exposing the key.

### Seed data covering all execution states

The seed script creates realistic demo data across all six execution states — `SUCCESS`, `FAILED`, `RETRYING`, `PENDING`, `QUEUED`, `RUNNING` — across four workflows with structured logs for each, making the dashboard immediately meaningful on first login.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth v4, credentials provider, JWT session |
| Database | PostgreSQL (local / Neon in production) |
| ORM | Prisma v7 with PrismaPg adapter |
| Queue | BullMQ + Upstash Redis (architecture ready) |
| Email | Resend |
| Validation | Zod v3 |
| Password hashing | bcryptjs (cost factor 12) |
| Dates | date-fns (formatDistanceToNow) |
| Deployment | Vercel (app) + Neon (database) |

---

## Database schema

```
User           id, name, email, passwordHash
Workspace      id, userId, signingSecret
Workflow       id, workspaceId, name, actionType, actionConfig, status, webhookId
Execution      id, workflowId, status, durationMs, payload, startedAt, completedAt
ExecutionLog   id, executionId, level, message, timestamp
ApiKey         id, workspaceId, name, keyHash, keyPreview, createdAt, lastUsedAt
```

Cascade deletes are configured throughout — deleting a workspace removes all workflows, executions, and logs.

---

## Screens

| Screen | Route | Description |
|---|---|---|
| Landing | `/` | Product overview, architecture diagram, GitHub link |
| Register | `/register` | Create account — creates User + Workspace atomically |
| Login | `/login` | JWT session via NextAuth credentials provider |
| Dashboard | `/app/dashboard` | 6 stat cards, recent executions, workflow health, recent failures |
| Workflows | `/app/workflows` | List with name, trigger, action type, status, last run |
| Create Workflow | `/app/workflows/new` | 4-step form — name, trigger, action, configuration |
| Workflow Detail | `/app/workflows/:id` | Webhook endpoint card, action config, execution history |
| Executions | `/app/executions` | Filterable list — All, Success, Failed, Pending, Retrying |
| Execution Detail | `/app/executions/:id` | Status, duration, event payload, full structured log |
| Settings | `/app/settings` | Profile, API keys, signing secret, danger zone |

---

## Running locally

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# Run database migrations
npx prisma migrate dev

# Seed demo data
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Demo credentials after seeding:
```
Email:    demo@relay.dev
Password: demo123456
```

Test the webhook pipeline:

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:3000/api/webhooks/YOUR_WEBHOOK_ID" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"type": "payment.succeeded", "amount": 4900, "currency": "usd"}'
```



## What this demonstrates

This project is not a CRUD app. It implements the core internals of a real SaaS developer tool:

- Event ingestion with signature verification
- Async job processing with structured logging
- Multi-tenant workspace architecture
- Production-grade auth with hashed credentials and JWT sessions
- Feature-first codebase that scales without circular dependencies
- Real observability — every execution is inspectable down to the millisecond

The architecture directly mirrors how systems like Zapier, Make, Trigger.dev, and Inngest work at their core.

