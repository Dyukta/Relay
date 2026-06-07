export interface ActionHandler {
  execute(
    executionId: string,
    config: Record<string, unknown>,
    payload: Record<string, unknown>
  ): Promise<void>
}