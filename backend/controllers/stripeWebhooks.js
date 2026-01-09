import stripe from "stripe";
import Booking from "../models/Booking.js";
//api to handle stripe webhooks

export const stripeWebhooks = async (req, res) => {
    console.log("hahaha")
  // stripe gateway initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error : ${error.message}`);
  }

  //handle the event

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    console.log("done2");
    // getting session metadata
    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const { bookingId } = session.data[0].metadata;
    // mark payment as paid
    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "Stripe",
    });
    console.log("done");
  } else {
    console.log("Unhandled event type :", event.type);
  }

  return res.json({ received: true });
};
