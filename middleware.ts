export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transfer/:path*",
    "/transactions/:path*",
    "/cards/:path*",
    "/loans/:path*",
    "/investments/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/payment-gateway/:path*",
    "/onboarding/:path*"
  ]
}
