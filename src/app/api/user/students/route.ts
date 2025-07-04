import { getSession, updateTokens } from "@/app/lib/session";
import { BACKEND_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  let res = await fetch(`${BACKEND_URL}/user/students`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    credentials: "include",
  });

  if (res.status === 401) {
    // Try to refresh - the refresh token is automatically sent via cookies
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    
    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      await updateTokens({ accessToken });
      // Retry original request
      res = await fetch(`${BACKEND_URL}/user/students`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
    } else {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const data = await res.text();
  return new Response(data, { status: res.status });
} 