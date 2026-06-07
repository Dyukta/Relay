import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getProfile,
  updateProfile,
} from "@/features/settings/services/settingsService"
import { logger } from "@/lib/logger"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await getProfile(session.user.id)
    return NextResponse.json(profile)
  } catch (error) {
    logger.error("Get profile error", { error })
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    )
  }
}

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = profileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const profile = await updateProfile(session.user.id, parsed.data)
    return NextResponse.json(profile)
  } catch (error) {
    logger.error("Update profile error", { error })
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}