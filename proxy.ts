import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const authorization = req.headers.get("authorization");

  console.log("🔥 CLERK PROXY HIT:", req.nextUrl.pathname);

  console.log("🔥 AUTH HEADER:", {
    exists: !!authorization,
    startsWithBearer: authorization?.startsWith("Bearer "),
    length: authorization?.length,
  });

  const authResult = await auth();

  console.log("🔥 PROXY AUTH:", {
    isAuthenticated: authResult.isAuthenticated,
    userId: authResult.userId,
    sessionId: authResult.sessionId,
    tokenType: authResult.tokenType,
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};