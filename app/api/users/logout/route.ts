import { NextRequest, NextResponse } from "next/server";
import db from "@/models/users";

export async function POST(request: NextRequest) {
  const body = await request.json();
  await db.removeUser(body.minecraft_id);
  return NextResponse.json("ok", { status: 200 });
}
