import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;

    const url = req.nextUrl.clone();

    // If user is logged in but NOT onboarded
    if (token && !token.onboarded && url.pathname !== "/onboarding") {
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    // If user IS onboarded and tries to access onboarding again
    if (token?.onboarded && url.pathname === "/onboarding") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/groups/:path*", "/onboarding"],
};