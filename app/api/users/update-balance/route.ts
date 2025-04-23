import { NextRequest, NextResponse } from "next/server";
import updateBalance from "@/models/updateBalance";
import { decodeSecret } from "@/lib/decodeSecret.js";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const headers = request.headers;

  try {
    const encryptedSecret = headers.get("matscraft-secret");

    if (!encryptedSecret) {
      return NextResponse.json({ message: "Missing matscraft-secret Header" }, { status: 401 });
    }

    const secret = decodeSecret(encryptedSecret);
    console.log("DECODED_SECRET:"+secret)
    if (typeof secret !== "object" || !secret.expires) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (Math.floor(Date.now() / 1000) > secret.expires) {
      return NextResponse.json({ message: "Token Expired" }, { status: 401 });
    }

    const response = await updateBalance(body.discord_id, body.amount);

    if (response.status !== 200) {
      return NextResponse.json({ message: "Failed to update balance" }, { status: 400 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Error updating balance:", err);
    return NextResponse.json({ message: "Invalid Secret!" }, { status: 401 });
  }
}
