import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/db/crud/activities/write";
import { getUserByEmail } from "@/lib/db/crud/users/read";
import { createUser } from "@/lib/db/crud/users/write";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify x-api-key header security
    const apiKey = request.headers.get("x-api-key");
    const systemApiKey = process.env.BEMMS_SIGNUP_API_KEY;

    if (!systemApiKey) {
      return NextResponse.json(
        { error: "Internal Server Error: System BEMMS_SIGNUP_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    if (!apiKey || apiKey !== systemApiKey) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing x-api-key" },
        { status: 401 }
      );
    }

    // 2. Parse request payload
    const body = await request.json();
    const { name, email, password, role, specialty } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Bad Request: Missing required parameters (name, email, password, role)" },
        { status: 400 }
      );
    }

    const normalizedRole = role.toUpperCase();
    if (normalizedRole !== "ADMIN" && normalizedRole !== "TECHNICIAN" && normalizedRole !== "CLINICAL") {
      return NextResponse.json(
        { error: "Bad Request: Invalid role. Must be 'ADMIN', 'TECHNICIAN', or 'CLINICAL'" },
        { status: 400 }
      );
    }

    // 3. Prevent duplicates
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Conflict: Email address is already registered" },
        { status: 409 }
      );
    }

    // 4. Secure password and create user
    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = await createUser({
      name,
      email,
      passwordHash,
      role: normalizedRole,
      specialty: normalizedRole === "TECHNICIAN" ? specialty || "General Electronics" : null,
      status: "Available",
    });

    if (!newUser) {
      return NextResponse.json(
        { error: "Internal Server Error: Database failure creating user" },
        { status: 500 }
      );
    }

    // 5. Audit log
    await logActivity(
      `Registered user account remotedly via Secured API: ${newUser.name} (${newUser.role})`,
      "Secured REST API"
    );

    // Return created details without password hash
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          specialty: newUser.specialty,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Secured Signup API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
