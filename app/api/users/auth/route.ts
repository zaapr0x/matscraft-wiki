import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/models/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { status, data, message } = await auth(
    body.token,
    body.minecraft_username,
    body.minecraft_id
  );
  if (status !== 200) {
    return NextResponse.json({ message }, { status });
  }
  console.log(data);
  return NextResponse.json(data, { status });
}
