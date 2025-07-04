import { getSession } from "./session";
import { BACKEND_URL } from "./constants";

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const authFetch = async (
  url: string | URL,
  options: FetchOptions = {}
) => {
  console.log("🌐 AuthFetch called for URL:", url);
  
  const session = await getSession();
  console.log("🌐 AuthFetch - Session found:", session ? "YES" : "NO");
  if (!session) {
    console.log("❌ AuthFetch - No session found");
    throw new Error("No session found");
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`,
  };
  console.log("🌐 AuthFetch - Making request with access token");

  let response = await fetch(url, options);
  console.log("🌐 AuthFetch - Response status:", response.status);

  if (response.status === 401) {
    console.log("🔄 AuthFetch - Access token expired, attempting refresh");
    // Try to refresh token using HTTP-only cookie
    const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    console.log("🔄 AuthFetch - Refresh response status:", refreshResponse.status);

    if (refreshResponse.ok) {
      const { accessToken } = await refreshResponse.json();
      console.log("✅ AuthFetch - Refresh successful, updating session");
      
      // Update session with new access token
      const updateResponse = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });
      console.log("🌐 AuthFetch - Update session response status:", updateResponse.status);
      
      // Retry original request with new token
      console.log("🌐 AuthFetch - Retrying original request with new token");
      options.headers.Authorization = `Bearer ${accessToken}`;
      response = await fetch(url, options);
      console.log("🌐 AuthFetch - Retry response status:", response.status);
    } else {
      console.log("❌ AuthFetch - Refresh failed");
      throw new Error("Failed to refresh token");
    }
  }
  
  console.log("🌐 AuthFetch - Final response status:", response.status);
  return response;
};