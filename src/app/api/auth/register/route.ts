import { NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/features/auth/schemas/registerSchema"
import { registerUser } from "@/features/auth/services/registerService"
import { logger } from "@/lib/logger"

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()

    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const result = await registerUser(parsed.data)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    )
  } catch (error) {
    logger.error("Register route error", { error })
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}