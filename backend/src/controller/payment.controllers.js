import { asyncHandler } from "../utils/AsyncHandler.js";
import Stripe from "stripe";

const payment = asyncHandler(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { C } = req.body;

  const lineItems = {
    price_data: {
      currency: "inr",
      product_data: {
        name: C.title,
      },
      unit_amount: C.price * 100,
    },
    quantity: 1,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [lineItems],
    mode: "payment",
    success_url: `http://localhost:3000/${C?._id}/success`,
    cancel_url: "https://www.facebook.com",
  });

  res.json({ id: session.id });
});

export { payment };
