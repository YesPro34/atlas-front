import { BACKEND_URL } from "@/app/lib/constants";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🧪 Frontend test cookies API called");
  console.log("🧪 Frontend - Request cookies:", req.headers.get('cookie'));
  console.log("🧪 Frontend - All request headers:", Object.fromEntries(req.headers.entries()));
  console.log("🧪 Frontend - BACKEND_URL:", BACKEND_URL);
  
  if (!BACKEND_URL) {
    return Response.json({
      message: "BACKEND_URL not configured",
      error: "NEXT_PUBLIC_BACKEND_URL environment variable is not set"
    });
  }
  
  try {
    // Make a simple request to the backend to test connectivity
    const testRes = await fetch(`${BACKEND_URL}/auth/test-cookies`, {
      method: "GET",
      credentials: "include",
    });
    
    console.log("🧪 Frontend - Backend test response status:", testRes.status);
    console.log("🧪 Frontend - Backend response headers:", Object.fromEntries(testRes.headers.entries()));
    
    if (testRes.ok) {
      const result = await testRes.json();
      console.log("🧪 Frontend - Backend test result:", result);
      
      return Response.json({
        message: "Cookie test completed",
        backendResult: result,
        frontendCookies: req.headers.get('cookie'),
        backendUrl: BACKEND_URL
      });
    } else {
      const errorText = await testRes.text();
      console.log("🧪 Frontend - Backend test failed:", errorText);
      
      return Response.json({
        message: "Backend test failed",
        error: errorText,
        status: testRes.status,
        frontendCookies: req.headers.get('cookie'),
        backendUrl: BACKEND_URL
      });
    }
  } catch (error) {
    console.error("🧪 Frontend - Cookie test error:", error);
    return Response.json({
      message: "Test failed",
      error: error instanceof Error ? error.message : String(error),
      frontendCookies: req.headers.get('cookie'),
      backendUrl: BACKEND_URL
    });
  }
} 