require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  [1, { priceInDollars: 100, name: "Build a structure from scratch" }],
  [2, { priceInDollars: 200, name: "Build a structure from template" }],
  [3, { priceInDollars: 300, name: "Build a custom model" }],
  [4, { priceInDollars: 400, name: "Build a prototype" }],
  [5, { priceInDollars: 500, name: "Build an advanced structure" }],
  [6, { priceInDollars: 600, name: "Build a smart structure" }],
  [7, { priceInDollars: 700, name: "Build a modular structure" }],
  [8, { priceInDollars: 800, name: "Build a futuristic model" }],
]);

app.post("/create-checkout-session", async (req, res) => {
  console.log("Incoming request:", req.body);
  try {
    const { items } = req.body;

    const lineItems = items.map((item) => {
      const storeItem = storeItems.get(item.id);
      if (!storeItem) {
        throw new Error(`No item found for id: ${item.id}`);
      }
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: storeItem.name,
          },
          unit_amount: storeItem.priceInDollars * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
