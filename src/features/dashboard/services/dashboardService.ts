import { prisma } from "@/lib/prisma"
import type { DashboardData } from "@/features/dashboard/types/dashboard.types"

export const getDashboardData = async (
  workspaceId: string
): Promise<DashboardData> => {
  const [  workflows, totalExecutions, successfulExecutions, failedExecutions, avgDuration, recentExecutions, recentFailures, failures24h ] = await Promise.all([
    prisma.workflow.findMany({
      where: { workspaceId },
      select: { status: true }
    }),

    prisma.execution.count({
      where: { workflow: { workspaceId } }
    }),

    prisma.execution.count({
      where: { workflow: { workspaceId }, status: "SUCCESS" }
    }),

    prisma.execution.count({
      where: { workflow: { workspaceId }, status: "FAILED" }
    }),

    prisma.execution.aggregate({
      where: { workflow: { workspaceId }, status: "SUCCESS" },
      _avg: { durationMs: true },
    }),

    prisma.execution.findMany({
      where: { workflow: { workspaceId } },
      orderBy: { startedAt: "desc" },
      take: 10,
      include: { workflow: { select: { name: true } } }
    }),

    prisma.execution.findMany({
      where: { workflow: { workspaceId }, status: "FAILED" },
      orderBy: { startedAt: "desc" },
      take: 2,
      include: { workflow: { select: { name: true } } }
    }),

    prisma.execution.count({
      where: {
        workflow: { workspaceId },
        status: "FAILED",
        startedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    })
  ])

  const totalWorkflows = workflows.length
  const active = workflows.filter((w) => w.status === "ACTIVE").length
  const disabled = workflows.filter((w) => w.status === "DISABLED").length
  const successRate =
    totalExecutions > 0
      ? Math.round((successfulExecutions / totalExecutions) * 100 * 10) / 10
      : 0

  return {
    stats: {
      totalWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate,
      avgDurationMs: Math.round(avgDuration._avg.durationMs ?? 0)
    },
    health: {
      active,
      disabled,
      failures24h
    },
    recentExecutions: recentExecutions.map((e) => ({
      id: e.id,
      workflowId: e.workflowId,
      workflowName: e.workflow.name,
      status: e.status,
      durationMs: e.durationMs,
      startedAt: e.startedAt
    })),
    recentFailures: recentFailures.map((e) => ({
      id: e.id,
      workflowName: e.workflow.name,
      startedAt: e.startedAt
    }))
  }
}