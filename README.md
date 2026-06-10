# Relay

Relay is a webhook driven workflow automation platform built with Next.js, TypeScript, PostgreSQL and Prisma.

It allows users to create workflows that receive events from external services, execute actions asynchronously and track the full execution lifecycle through structured logs and status history.

The project was built to explore the architecture behind developer focused automation tools: webhook ingestion, signature verification, job processing, execution tracking and multi tenant application design.

live link: https://relay-taupe-tau.vercel.app/

---

## Overview

A workflow consists of:

* A webhook endpoint
* An action configuration
* Execution history

When an external service sends a request to a workflow endpoint, Relay:

1. Verifies the request signature
2. Creates an execution record
3. Queues the execution
4. Processes the configured action
5. Records execution logs and status changes
6. Exposes the result through the dashboard

```text
External Service
        │
        ▼
Webhook Endpoint
        │
        ├── Signature Verification
        ├── Execution Creation
        └── Job Processing
                │
                ├── Send Email
                ├── Forward Webhook
                ├── Persist Logs
                └── Update Status
```

---

## Key Features

### Webhook Processing

Each workflow receives a unique webhook endpoint.

Incoming requests are verified using HMAC-SHA256 signatures before any execution is created.

### Execution Tracking

Every workflow execution maintains:

* Status history
* Structured logs
* Execution duration
* Original payload
* Completion metadata

Supported execution states:

```text
PENDING
QUEUED
RUNNING
SUCCESS
FAILED
RETRYING
```

### Structured Logging

Every stage of execution writes timestamped log entries.

```text
11:13:12.993  INFO     Event received
11:13:13.010  INFO     Job queued
11:13:13.087  INFO     Worker picked up job
11:13:13.113  INFO     Sending email
11:13:13.373  SUCCESS  Email delivered
11:13:13.382  SUCCESS  Execution completed
```

### Dynamic Templates

Workflow actions support template interpolation using payload data.

```text
Subject:
New payment: {{event.type}}

Payload:
{
  "event": {
    "type": "payment.succeeded"
  }
}

Result:
New payment: payment.succeeded
```

### API Keys

API keys are generated using cryptographically secure randomness and stored as bcrypt hashes.

Only a masked preview is persisted:

```text
ak_live_8f12...8821
```

---

## Architecture

The application follows a feature-first structure.

```text
src/features/
  auth/
  dashboard/
  executions/
  settings/
  workflows/
```

Each feature owns its:

* Components
* Hooks
* Services
* Schemas
* Types

Shared utilities remain isolated from domain logic.

### Application Layers

```text
UI Components
      │
      ▼
Hooks
      │
      ▼
API Routes
      │
      ▼
Services
      │
      ▼
Prisma
      │
      ▼
PostgreSQL
```

Rules followed throughout the codebase:

* Components never access the database
* Hooks contain no business logic
* API routes never contain Prisma queries
* Services own all domain operations
* Utility modules remain framework independent

---

## Security

### Password Storage

Passwords are hashed using bcrypt before persistence.

### Signature Verification

Webhook requests are validated using HMAC-SHA256 signatures and compared using `timingSafeEqual` to prevent timing attacks.

```ts
export const verifySignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const expected = signPayload(payload, secret)

  const expectedBuffer = Buffer.from(expected, "hex")
  const receivedBuffer = Buffer.from(signature, "hex")

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer)
}
```

### Multi-Tenant Isolation

Each user owns a workspace with:

* Independent workflows
* Independent executions
* Independent API keys
* Independent signing secrets

---

## Database Schema

```text
User
 └── Workspace
      ├── Workflow
      │     └── Execution
      │            └── ExecutionLog
      │
      └── ApiKey
```

Cascade deletes are configured across dependent relationships.

---

## Tech Stack

| Layer              | Technology      |
| ------------------ | --------------- |
| Framework          | Next.js 16      |
| Language           | TypeScript      |
| Styling            | Tailwind CSS v4 |
| Database           | PostgreSQL      |
| ORM                | Prisma          |
| Authentication     | NextAuth        |
| Validation         | Zod             |
| Email              | Resend          |
| Queue Architecture | BullMQ + Redis  |
| Deployment         | Vercel + Neon   |

---

## Running Locally

```bash
npm install

cp .env.example .env.local

npx prisma migrate dev

npx tsx prisma/seed.ts

npm run dev
```

### Demo Account

```text
Email:    demo@relay.dev
Password: demo123456
```

---

## Future Work

* Background workers using BullMQ
* Retry policies with exponential backoff
* Execution replay
* Dead-letter queues
* Webhook delivery metrics
* Real-time execution updates
* Workflow versioning
* Additional action providers
