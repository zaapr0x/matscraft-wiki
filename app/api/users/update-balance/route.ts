import { NextRequest, NextResponse } from "next/server";
import db from "@/models/users";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  const { status, balance, message } = await db.updateBalance(
    body.minecraft_id,
    body.amount
  );
  console.log(message);
  return NextResponse.json({ balance }, { status });
}
