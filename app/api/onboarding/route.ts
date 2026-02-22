import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
type OnboardingBody = {
  name?: string;
  birthday: string; // YYYY-MM-DD
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string; // default US
};

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: OnboardingBody;
  try {
    body = (await req.json()) as OnboardingBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const {
    name,
    birthday,
    line1,
    line2,
    city,
    state,
    postalCode,
    country = "US",
  } = body;

  // Basic validation
  if (!birthday) return badRequest("Birthday is required");
  if (!line1) return badRequest("Address line 1 is required");
  if (!city) return badRequest("City is required");
  if (!state) return badRequest("State is required");
  if (!postalCode) return badRequest("Postal code is required");

  // Parse birthday date (YYYY-MM-DD)
  const birthdayDate = new Date(`${birthday}T00:00:00.000Z`);
  if (Number.isNaN(birthdayDate.getTime())) {
    return badRequest("Birthday must be a valid date");
  }

  // Look up user by email (reliable even if session doesn't include id)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  // Update user + upsert address
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name?.trim() || undefined,
      birthday: birthdayDate,
      address: {
        upsert: {
          create: {
            line1: line1.trim(),
            line2: line2?.trim() || null,
            city: city.trim(),
            state: state.trim().toUpperCase(),
            postalCode: postalCode.trim(),
            country: country.trim().toUpperCase(),
          },
          update: {
            line1: line1.trim(),
            line2: line2?.trim() || null,
            city: city.trim(),
            state: state.trim().toUpperCase(),
            postalCode: postalCode.trim(),
            country: country.trim().toUpperCase(),
          },
        },
      },
    },
  });

  return NextResponse.json({ ok: true });
}