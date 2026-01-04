import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function POST() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://time-capsule-sandy.vercel.app";

  // One-time payment, price set dynamically (no Stripe Product required)
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Confession Slot" },
          unit_amount: 100, // $1.00 (in cents) — we’ll make dynamic later
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/success`,
    cancel_url: `${baseUrl}/cancel`,
  });

  return Response.json({ url: session.url });
}
