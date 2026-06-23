export async function POST(req: Request) {
  try {
    const { playerIds, latitude, longitude } = await req.json();

    const response = await fetch(
      "https://api.onesignal.com/notifications",
      {
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

          url: `https://en-yakin-oed.vercel.app/?lat=${latitude}&lng=${longitude}`,
        }),
      }
    );

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "push error" }, { status: 500 });
  }
}