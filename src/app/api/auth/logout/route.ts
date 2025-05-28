import { authFetch } from "@/app/lib/authFetch";
import { BACKEND_URL } from "@/app/lib/constants";
import { deleteSession } from "@/app/lib/session";
import { revalidatePath } from "next/cache";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const respone = await authFetch(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
  });
  if (respone.ok) {
    await deleteSession();
  }
  revalidatePath("/login")
  //redirect("/login", RedirectType.push);
  return NextResponse.redirect(new URL("/login", req.nextUrl));
}