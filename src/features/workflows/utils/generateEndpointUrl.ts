export const generateEndpointUrl = (webhookId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  return `${baseUrl}/api/webhooks/${webhookId}`
}