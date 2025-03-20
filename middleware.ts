import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
 
export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.
	const response = sessionCookie ? NextResponse.next() : NextResponse.redirect(new URL("/", request.url));
	
	// Add the pathname as a header to be used by ProfileGate for path detection
	response.headers.set("x-pathname", request.nextUrl.pathname);
	
	return response;
}
 
export const config = {
	// Apply middleware to all routes to ensure x-pathname header is set everywhere
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};