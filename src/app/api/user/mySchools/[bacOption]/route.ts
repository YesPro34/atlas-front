import { getSession, updateTokens } from "@/app/lib/session";
import { BACKEND_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  // Extract bacOption from the URL
  const bacOption = req.nextUrl.pathname.split("/").pop();

  let res = await fetch(`${BACKEND_URL}/user/mySchools/${bacOption}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    credentials: "include",
  });

  if (res.status === 401) {
    // Try to refresh - the refresh token is automatically sent via cookies
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    
    console.log("Refresh response status:", refreshRes.status);
    
    if (refreshRes.ok) {
      const { accessToken, refreshToken } = await refreshRes.json();
      console.log("Refresh successful, updating tokens");
      await updateTokens({ accessToken });
      // Retry original request
      res = await fetch(`${BACKEND_URL}/user/mySchools/${bacOption}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
    } else {
      console.log("Refresh failed, status:", refreshRes.status);
      const errorText = await refreshRes.text();
      console.log("Refresh error:", errorText);
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const data = await res.text();
  return new Response(data, { status: res.status });
} 