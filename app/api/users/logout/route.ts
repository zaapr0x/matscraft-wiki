import { NextRequest, NextResponse } from "next/server";
import logout from "@/models/logout";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await logout(body.minecraft_id);
  if (!response) {
    return NextResponse.json({ message: "Failed Logout" }, { status: 400 });
  }

  return NextResponse.json(response, { status: 200 });
}
