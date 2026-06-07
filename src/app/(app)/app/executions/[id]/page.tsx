import { ExecutionDetailPage } from "@/features/executions/components/ExecutionDetailPage"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ExecutionDetailPage executionId={id} />
}