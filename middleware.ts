import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// add paths which need to bypass basic authentication check

export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // skip basic auth for home page and next static files
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api")) {
    const basicAuth = request.headers.get("authorization");

    // base64 dGVzdGVyOmFzb2ljODJDUzk4MTA5MWRzZHAzNW1ud3Vq
    const username = process.env.BASIC_AUTH_USERNAME || "tester";
    const password = "asoic82CS981091dsdp35mnwuj"; // Example password

    const authString = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

    if (basicAuth === authString) {
      return NextResponse.next();
    }
    console.log("auth should deny request");
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }
  return NextResponse.next();
}
