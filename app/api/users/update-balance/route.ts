import { NextRequest, NextResponse } from "next/server";
import updateBalance from "@/models/updateBalance";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const response = await updateBalance(body.discord_id, body.amount);
  if (!response) {
    return NextResponse.json(
      { message: "Failed Update Balance" },
      { status: 400 }
    );
  }

  return NextResponse.json(response, { status: 200 });
}
