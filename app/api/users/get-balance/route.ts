import { NextRequest, NextResponse } from "next/server";
import db from "@/models/users";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { status, balance } = await db.getBalance(body.discord_id);
  if (status === 200) {
    return NextResponse.json(balance, { status });
  }

  return NextResponse.json({ balance }, { status });
}
