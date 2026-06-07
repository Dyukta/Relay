import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import type { ExecutionStatus } from "@/features/executions/types/execution.types"

export const getExecutions = async (
  workspaceId: string,
  status?: ExecutionStatus
) => {
  return prisma.execution.findMany({
    where: {
      workflow: { workspaceId },
      ...(status ? { status } : {}),
    },
    orderBy: { startedAt: "desc" },
    take: 50,
    include: {
      workflow: { select: { id: true, name: true } },
    },
  })
}

export const getExecutionById = async (
  executionId: string,
  workspaceId: string
) => {
  return prisma.execution.findFirst({
    where: {
      id: executionId,
      workflow: { workspaceId },
    },
    include: {
      workflow: { select: { id: true, name: true } },
      logs: { orderBy: { timestamp: "asc" } },
    },
  })
}

export const createExecution = async (workflowId: string, payload: unknown) => {
  const execution = await prisma.execution.create({
    data: {
      workflowId,
      status: "PENDING",
      payload: payload as any,
    },
  })

  logger.info("Execution created", { executionId: execution.id, workflowId })

  return execution
}

export const updateExecutionStatus = async (
  executionId: string,
  status: ExecutionStatus,
  durationMs?: number
) => {
  return prisma.execution.update({
    where: { id: executionId },
    data: {
      status,
      ...(durationMs !== undefined ? { durationMs } : {}),
      ...(status === "SUCCESS" || status === "FAILED"
        ? { completedAt: new Date() }
        : {}),
    },
  })
}

export const appendExecutionLog = async (
  executionId: string,
  level: string,
  message: string
) => {
  return prisma.executionLog.create({
    data: { executionId, level, message },
  })
}