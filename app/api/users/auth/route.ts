import { NextRequest, NextResponse } from "next/server";
import auth from "@/models/auth";
import { getBalance, updateBalance } from "@/lib/drip";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { status, data, message } = await auth.auth(body);
  if (status === 200) {
    return NextResponse.json(data, { status });
  }

  return NextResponse.json({ message }, { status });
}
