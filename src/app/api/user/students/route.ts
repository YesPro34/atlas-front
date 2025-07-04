import { getSession, updateTokens } from "@/app/lib/session";
import { BACKEND_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("📚 Students API route called");
  
  const session = await getSession();
  console.log("📚 Students - Session found:", session ? "YES" : "NO");
  if (!session) return new Response("Unauthorized", { status: 401 });

  console.log("📚 Students - Making request to backend with access token");
  let res = await fetch(`${BACKEND_URL}/user/students`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    credentials: "include",
  });

  console.log("📚 Students - Backend response status:", res.status);
  
  if (res.status === 401) {
    console.log("🔄 Students - Access token expired, attempting refresh");
    // Try to refresh - the refresh token is automatically sent via cookies
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    
    console.log("🔄 Students - Refresh response status:", refreshRes.status);
    
    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      console.log("✅ Students - Refresh successful, updating session");
      await updateTokens({ accessToken });
      // Retry original request
      console.log("📚 Students - Retrying original request with new token");
      res = await fetch(`${BACKEND_URL}/user/students`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      console.log("📚 Students - Retry response status:", res.status);
    } else {
      console.log("❌ Students - Refresh failed");
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const data = await res.text();
  console.log("📚 Students - Final response status:", res.status);
  return new Response(data, { status: res.status });
} 