import { updateTokens } from "@/app/lib/session";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("🔄 Auth update API route called");
  
  const body = await req.json();
  const { accessToken } = body;

  console.log("🔄 Auth update - Access token provided:", !!accessToken);

  if (!accessToken) {
    console.log("❌ Auth update - No access token provided");
    return new Response("Provide Access Token", { status: 401 });
  }

  console.log("🔄 Auth update - Updating session tokens");
  await updateTokens({ accessToken });
  console.log("✅ Auth update - Session tokens updated successfully");

  return new Response("OK", { status: 200 });
}