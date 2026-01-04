import Stripe from "stripe";

export const runtime = "nodejs"; // Stripe requires Node runtime

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // We will add Firestore logic next
  if (
    event.type === "checkout.session.completed" ||
    event.type === "payment_intent.succeeded"
  ) {
    // placeholder
  }

  return new Response("ok", { status: 200 });
}
