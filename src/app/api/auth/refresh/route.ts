import { BACKEND_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      return Response.json({ accessToken });
    } else {
      return new Response("Unauthorized", { status: 401 });
    }
  } catch (error) {
    console.error("Refresh error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 