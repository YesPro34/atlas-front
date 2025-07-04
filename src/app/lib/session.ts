"use server";

import { jwtVerify, SignJWT } from "jose";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BacOption, Role } from "./type";

export type Session = {
  user: {
    id: string;
    massarCode: string;
    role: Role;
    bacOption: BacOption;
  };
  accessToken: string;
};

const secretKey = process.env.SESSION_SECRET_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  console.log("📝 Creating session for user:", payload.user.id);
  
  const expiredAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  await (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
  console.log("✅ Session created successfully");
}

export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  console.log("🔍 Getting session, cookie exists:", !!cookie);
  
  if (!cookie) return null;
  
  try {
    const { payload } = await jwtVerify(
      cookie,
      encodedKey,
      {
        algorithms: ["HS256"],
      }
    );

    console.log("✅ Session verified successfully for user:", (payload as Session).user.id);
    return payload as Session;
  } catch (err) {
    console.error("❌ Failed to verify the session", err);
    redirect("/login");
  }
}

export async function deleteSession() {
  await (await cookies()).delete("session");
}

export async function updateTokens({
  accessToken,
}: {
  accessToken: string;
}) {
  console.log("🔄 Updating session tokens");
  
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    console.log("❌ No session cookie found for token update");
    return null;
  }

  const { payload } = await jwtVerify<Session>(
    cookie,
    encodedKey
  );

  if (!payload) {
    console.log("❌ Session payload not found for token update");
    throw new Error("Session not found");
  }

  const newPayload: Session = {
    user: {
      ...payload.user,
    },
    accessToken,
  };

  console.log("🔄 Creating new session with updated tokens");
  await createSession(newPayload);
  console.log("✅ Session tokens updated successfully");
}