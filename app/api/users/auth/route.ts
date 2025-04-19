import { NextRequest, NextResponse } from "next/server";
import auth from "@/models/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { status, message } = await auth.auth(body);

  return NextResponse.json({ message }, { status });
}
