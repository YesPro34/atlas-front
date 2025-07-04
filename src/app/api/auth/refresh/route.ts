import { BACKEND_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("🔄 Auth refresh API route called");
  console.log("🔄 Auth refresh - Request headers:", Object.fromEntries(req.headers.entries()));
  
  try {
    console.log("🔄 Auth refresh - Making request to backend refresh endpoint");
    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    console.log("🔄 Auth refresh - Backend response status:", refreshRes.status);
    console.log("🔄 Auth refresh - Backend response headers:", Object.fromEntries(refreshRes.headers.entries()));

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      console.log("✅ Auth refresh - Successfully got new access token");
      return Response.json({ accessToken });
    } else {
      const errorText = await refreshRes.text();
      console.log("❌ Auth refresh - Backend refresh failed:", errorText);
      return new Response("Unauthorized", { status: 401 });
    }
  } catch (error) {
    console.error("❌ Auth refresh - Error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 