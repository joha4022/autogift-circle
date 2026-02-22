import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

type OnboardingBody = {
  name?: string;
  birthday: string; // YYYY-MM-DD
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
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

  const { name, birthday, line1, line2, city, state, postalCode, country = "US" } = body;

  if (!birthday) return badRequest("Birthday is required");
  if (!line1) return badRequest("Address line 1 is required");
  if (!city) return badRequest("City is required");
  if (!state) return badRequest("State is required");
  if (!postalCode) return badRequest("Postal code is required");

  const birthdayDate = new Date(`${birthday}T00:00:00.000Z`);
  if (Number.isNaN(birthdayDate.getTime())) {
    return badRequest("Birthday must be a valid date");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: name?.trim() || undefined,
      birthday: birthdayDate,
      onboarded: true,
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