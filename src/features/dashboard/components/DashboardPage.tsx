"use client"

import { useDashboard } from "@/features/dashboard/hooks/useDashboard"
import { StatCard } from "@/features/dashboard/components/StatCard"
import { RecentExecutionsPanel } from "@/features/dashboard/components/RecentExecutionsPanel"
import { WorkflowHealthPanel } from "@/features/dashboard/components/WorkflowHealthPanel"
import { PageHeader } from "@/shared/components/PageHeader"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { formatDuration } from "@/shared/utils/formatDuration"

export const DashboardPage = () => {
  const { data, loading, error } = useDashboard()

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <p className="text-red-400 text-sm">{error}</p>
    )
  }

  if (!data) return null

  const { stats, health, recentExecutions, recentFailures } = data

  return (
    <div>
      <PageHeader
        title="Overview"
        description=" workflow activity and system health."
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          label="Total Workflows"
          value={stats.totalWorkflows}
        />
        <StatCard
          label="Total Executions"
          value={stats.totalExecutions.toLocaleString()}
        />
        <StatCard
          label="Successful"
          value={stats.successfulExecutions.toLocaleString()}
        />
        <StatCard
          label="Failed"
          value={stats.failedExecutions.toLocaleString()}
        />
        <StatCard
          label="Success Rate"
          value={`${stats.successRate}%`}
          highlight={stats.successRate >= 90}
        />
        <StatCard
          label="Avg Execution"
          value={formatDuration(stats.avgDurationMs)}
          sub="p50 latency"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RecentExecutionsPanel executions={recentExecutions} />
        </div>
        <div>
          <WorkflowHealthPanel
            health={health}
            recentFailures={recentFailures}
          />
        </div>
      </div>
    </div>
  )
}