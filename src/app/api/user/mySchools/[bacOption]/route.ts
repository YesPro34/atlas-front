import { getSession, updateTokens } from "@/app/lib/session";
import { BACKEND_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🏫 MySchools API route called");
  
  const session = await getSession();
  console.log("🏫 MySchools - Session found:", session ? "YES" : "NO");
  if (!session) return new Response("Unauthorized", { status: 401 });

  // Extract bacOption from the URL
  const bacOption = req.nextUrl.pathname.split("/").pop();
  console.log("🏫 MySchools - BacOption:", bacOption);

  console.log("🏫 MySchools - Making request to backend with access token");
  let res = await fetch(`${BACKEND_URL}/user/mySchools/${bacOption}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    credentials: "include",
  });

  console.log("🏫 MySchools - Backend response status:", res.status);

  if (res.status === 401) {
    console.log("🔄 MySchools - Access token expired, attempting refresh");
    // Try to refresh - the refresh token is automatically sent via cookies
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    
    console.log("🔄 MySchools - Refresh response status:", refreshRes.status);
    
    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      console.log("✅ MySchools - Refresh successful, updating session");
      await updateTokens({ accessToken });
      // Retry original request
      console.log("🏫 MySchools - Retrying original request with new token");
      res = await fetch(`${BACKEND_URL}/user/mySchools/${bacOption}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      console.log("🏫 MySchools - Retry response status:", res.status);
    } else {
      console.log("❌ MySchools - Refresh failed");
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const data = await res.text();
  console.log("🏫 MySchools - Final response status:", res.status);
  return new Response(data, { status: res.status });
} 