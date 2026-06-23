import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const playerIds = body.playerIds;

    const response = await fetch("https://api.onesignal.com/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: "3628049c-37d2-483e-afe9-f6eafae5761a",
        include_subscription_ids: playerIds,
        headings: {
          en: "🚨 Acil Durum",
        },
        contents: {
          en: "Yakınınızda CPR/OED ihtiyacı var!",
        },
      }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Push gönderilemedi" },
      { status: 500 }
    );
  }
}