import { updateTokens } from "@/app/lib/session";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { accessToken } = body;

  if (!accessToken)
    return new Response("Provide Access Token", { status: 401 });

  await updateTokens({ accessToken });

  return new Response("OK", { status: 200 });
}