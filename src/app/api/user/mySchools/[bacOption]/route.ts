import { getSession, updateTokens } from "@/app/lib/session";
import { BACKEND_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { bacOption: string } }) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  let res = await fetch(`${BACKEND_URL}/user/mySchools/${params.bacOption}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    credentials: "include",
  });

  if (res.status === 401 && session.refreshToken) {
    // Try to refresh
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      const { accessToken, refreshToken } = await refreshRes.json();
      await updateTokens({ accessToken, refreshToken });
      // Retry original request
      res = await fetch(`${BACKEND_URL}/user/mySchools/${params.bacOption}`, {
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