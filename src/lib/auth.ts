import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";

// JWT_SECRET is loaded from environment, with a strong fallback for development
const secretKey = process.env.JWT_SECRET || "bemms-default-32-character-secret-key-prod-super-safe";
const encodedKey = new TextEncoder().encode(secretKey);

// Derive a cryptographically secure 256-bit key using SHA-256 for A256GCM
const getCryptoKey = async () => {
  const hash = await crypto.subtle.digest("SHA-256", encodedKey);
  return new Uint8Array(hash);
};

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TECHNICIAN" | "CLINICAL";
  specialty?: string | null;
  status: string;
}

/**
 * Encrypts a payload into a JWE (JSON Web Encryption) string.
 */
export async function encryptToken(payload: SessionUser): Promise<string> {
  const key = await getCryptoKey();
  return new EncryptJWT(payload as any)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .encrypt(key);
}

/**
 * Decrypts a JWE string back into the SessionUser payload.
 */
export async function decryptToken(token: string): Promise<SessionUser | null> {
  try {
    const key = await getCryptoKey();
    const { payload } = await jwtDecrypt(token, key, {
      contentEncryptionAlgorithms: ["A256GCM"],
      keyManagementAlgorithms: ["dir"],
    });
    return payload as unknown as SessionUser;
  } catch (error) {
    console.error("Session JWE decryption failed:", error);
    return null;
  }
}

/**
 * Helper to retrieve and decrypt the current user session.
 * Safe to run in Server Components, Middleware (Edge), or Server Actions.
 */
export async function getServerSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bemms_session")?.value;
    if (!token) return null;
    return await decryptToken(token);
  } catch (error) {
    return null;
  }
}
