import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/models/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await auth(
    body.token,
    body.minecraft_username,
    body.minecraft_id
  );
  console.log(response);

  return NextResponse.json(response, { status: 200 });
}
