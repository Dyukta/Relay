import { createHmac, randomBytes, timingSafeEqual } from "crypto"

export const generateSecret = (): string => {
  const secret = randomBytes(32).toString("hex")
  return `whsec_${secret}`
}

export const signPayload = (payload: string, secret: string): string => {
  return createHmac("sha256", secret).update(payload).digest("hex")
}

export const verifySignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const expected = signPayload(payload, secret)
    const expectedBuffer = Buffer.from(expected, "hex")
    const receivedBuffer = Buffer.from(signature, "hex")

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false
    }

    return timingSafeEqual(expectedBuffer, receivedBuffer)
  } catch {
    return false
  }
}

export const generateApiKey = (): { raw: string; preview: string } => {
  const key = randomBytes(32).toString("hex")
  const raw = `ak_live_${key}`
  const preview = `${raw.slice(0, 12)}...${raw.slice(-4)}`
  return { raw, preview }
}