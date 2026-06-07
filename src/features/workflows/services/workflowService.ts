import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import type { CreateWorkflowInput } from "@/features/workflows/schemas/workflowSchema"

export const getWorkflows = async (workspaceId: string) => {
  return prisma.workflow.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { executions: true } },
      executions: {
        orderBy: { startedAt: "desc" },
        take: 1,
        select: { startedAt: true, status: true },
      },
    },
  })
}

export const getWorkflowById = async (
  workflowId: string,
  workspaceId: string
) => {
  return prisma.workflow.findFirst({
    where: { id: workflowId, workspaceId },
    include: {
      _count: { select: { executions: true } },
      executions: {
        orderBy: { startedAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          durationMs: true,
          startedAt: true,
          completedAt: true,
        },
      },
    },
  })
}

export const createWorkflow = async (
  workspaceId: string,
  input: CreateWorkflowInput
) => {
  const workflow = await prisma.workflow.create({
    data: {
      workspaceId,
      name: input.name,
      actionType: input.actionType,
      actionConfig: input.actionConfig,
    },
  })

  logger.info("Workflow created", {
    workflowId: workflow.id,
    workspaceId,
    name: workflow.name,
  })

  return workflow
}

export const deleteWorkflow = async (
  workflowId: string,
  workspaceId: string
) => {
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, workspaceId },
  })

  if (!workflow) {
    return null
  }

  await prisma.workflow.delete({ where: { id: workflowId } })

  logger.info("Workflow deleted", { workflowId, workspaceId })

  return workflow
}

export const updateWorkflowStatus = async (
  workflowId: string,
  workspaceId: string,
  status: "ACTIVE" | "DISABLED"
) => {
  return prisma.workflow.updateMany({
    where: { id: workflowId, workspaceId },
    data: { status }
  })
}