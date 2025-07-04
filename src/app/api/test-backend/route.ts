import { BACKEND_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🔧 Backend connectivity test called");
  console.log("🔧 BACKEND_URL:", BACKEND_URL);
  console.log("🔧 All environment variables:", {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
  
  if (!BACKEND_URL) {
    return Response.json({
      message: "BACKEND_URL not configured",
      error: "NEXT_PUBLIC_BACKEND_URL environment variable is not set",
      env: process.env.NODE_ENV
    });
  }
  
  try {
    // Try to reach the backend root
    const testRes = await fetch(`${BACKEND_URL}/api`, {
      method: "GET",
      credentials: "include",
    });
    
    console.log("🔧 Backend connectivity test response status:", testRes.status);
    
    return Response.json({
      message: "Backend connectivity test completed",
      backendUrl: BACKEND_URL,
      responseStatus: testRes.status,
      responseOk: testRes.ok,
      env: process.env.NODE_ENV
    });
  } catch (error) {
    console.error("🔧 Backend connectivity test error:", error);
    return Response.json({
      message: "Backend connectivity test failed",
      error: error instanceof Error ? error.message : String(error),
      backendUrl: BACKEND_URL,
      env: process.env.NODE_ENV
    });
  }
} 