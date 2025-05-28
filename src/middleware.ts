import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./app/lib/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user)
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  
  if (session.user.role == "ADMIN" && !req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
  }
    if (session.user.role == "ADMIN" && req.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (session.user.role == "STUDENT" && !req.nextUrl.pathname.startsWith("/home")) {
        return NextResponse.redirect(new URL("/home", req.url));
  }
  if (session.user.role == "STUDENT" && req.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/home", req.url));
  }
  NextResponse.next();
}

export const config = {
  matcher: ["/home", "/dashboard"],
};