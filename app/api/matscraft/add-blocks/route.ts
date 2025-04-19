import { NextRequest, NextResponse } from "next/server";
import db from "@/models/matscraft";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { message, data, status } = await db.insertBlock(body);

  return NextResponse.json({ message, data }, { status });
}
