import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export const middleware = async (req: NextRequest) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl

  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/app/dashboard", req.url))
  }

  if (!token && pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*", "/login", "/register"],
}