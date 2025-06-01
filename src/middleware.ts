import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./app/lib/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  
  // If not logged in and trying to access login page, allow it
  if ((!session || !session.user) && req.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  // If trying to access /login while already logged in
  if (req.nextUrl.pathname.startsWith("/login") && session?.user) {
    if (session.user.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
  }
    if (session.user.role === "STUDENT") {
      return NextResponse.redirect(new URL("/home", req.url));
  }
  }

  // If not logged in, redirect to login
  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  
  if (session.user.role === "ADMIN" && !req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (session.user.role === "STUDENT" && !req.nextUrl.pathname.startsWith("/home")) {
      return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/dashboard", "/login"],
};