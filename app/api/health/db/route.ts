import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Basic connectivity check
  const now = new Date();

  // If you already have a User model, we’ll do a harmless query
  const userCount = await prisma.user.count();

  return NextResponse.json({
    ok: true,
    db: "connected",
    userCount,
    timestamp: now.toISOString(),
  });
}
