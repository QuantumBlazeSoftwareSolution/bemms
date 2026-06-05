"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { logActivity } from "../db/crud/activities/write";
import { encryptToken, getServerSession, SessionUser } from "../auth";
import { getUserByEmail } from "../db/crud/users/read";
import { createUser } from "../db/crud/users/write";

export async function signInAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const roleInput = formData.get("role") as string; // E.g., "admin", "technician", "clinical"

    if (!email || !password || !roleInput) {
      return { success: false, error: "Please enter email, password, and select your role." };
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: "Invalid credentials." };
    }

    // Verify role matches (case insensitive check)
    if (user.role !== roleInput.toUpperCase()) {
      return { success: false, error: `Account exists but is not registered as ${roleInput}.` };
    }

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: "Invalid credentials." };
    }

    // Create session payload
    const sessionData: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialty: user.specialty,
      status: user.status,
    };

    // Encrypt JWE
    const encryptedToken = await encryptToken(sessionData);

    const cookieStore = await cookies();
    cookieStore.set("bemms_session", encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    await logActivity("Signed in successfully.", `${user.role === "ADMIN" ? "Manager" : user.role === "TECHNICIAN" ? "Tech" : "User"}. ${user.name}`);

    return { success: true, user: sessionData };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function signUpAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const roleInput = formData.get("role") as string; // "admin", "technician", "clinical"
    const specialty = formData.get("specialty") as string;

    if (!name || !email || !password || !roleInput) {
      return { success: false, error: "Missing required fields." };
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: "Email is already registered." };
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const role = roleInput.toUpperCase() as "ADMIN" | "TECHNICIAN" | "CLINICAL";

    const newUser = await createUser({
      name,
      email,
      passwordHash,
      role,
      specialty: role === "TECHNICIAN" ? specialty || "General Electronics" : null,
      status: "Available",
    });

    if (!newUser) {
      return { success: false, error: "Could not create user." };
    }

    // Auto log in after sign up
    const sessionData: SessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      specialty: newUser.specialty,
      status: newUser.status,
    };

    // Encrypt JWE
    const encryptedToken = await encryptToken(sessionData);

    const cookieStore = await cookies();
    cookieStore.set("bemms_session", encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    await logActivity("Registered a new account.", `${newUser.role === "ADMIN" ? "Manager" : newUser.role === "TECHNICIAN" ? "Tech" : "User"}. ${newUser.name}`);

    return { success: true, user: sessionData };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("bemms_session");
  return { success: true };
}

export async function getCurrentUserAction(): Promise<SessionUser | null> {
  return await getServerSession();
}

export async function registerTechnicianByAdminAction(prevState: any, formData: FormData) {
  try {
    const admin = await getCurrentUserAction();
    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Unauthorized: Only administrators can register technicians." };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const specialty = formData.get("specialty") as string;

    if (!name || !email || !password) {
      return { success: false, error: "Missing required fields." };
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: "Email is already registered." };
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const newUser = await createUser({
      name,
      email,
      passwordHash,
      role: "TECHNICIAN",
      specialty: specialty || "General Electronics & Monitoring",
      status: "Available",
    });

    if (!newUser) {
      return { success: false, error: "Could not create technician." };
    }

    await logActivity(
      `Registered new Technician account: ${newUser.name} (${newUser.specialty})`,
      `Admin. ${admin.name}`
    );

    return { success: true, user: newUser };
  } catch (error: any) {
    console.error("Register technician error:", error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
