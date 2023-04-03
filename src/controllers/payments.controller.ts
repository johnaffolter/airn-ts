import express from "express";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

import User from "../models/user";

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export const createStripeCustomer = async (user) => {
  console.log("TRYING TO CREATE STRIPE CUSTOMER!");
  const {
    phoneNumber,
    tier,
    firstName,
    lastName,
    userEmail,
  }: {
    phoneNumber: string;
    tier: string;
    firstName: string;
    lastName: string;
    userEmail: string;
  } = user;
  try {
    const params: Stripe.CustomerCreateParams = {
      description: `User with phone number ${phoneNumber} is subscribed to the "${tier} Tier"`,
      phone: phoneNumber,
      name: `${firstName ? firstName : "N/A"} ${lastName ? lastName : "N/A"}`,
      email: userEmail,
      metadata: {
        tier: tier,
      },
    };
    console.log(
      "🚀🚀🚀🚀 ~ file: payments.controller.ts:37 ~ createStripeCustomer ~ params:",
      params
    );
    const customer: Stripe.Customer = await stripe.customers.create(params, {
      apiKey: process.env.STRIPE_TEST_SECRET_KEY,
    });
    console.log(`STRIPE CUSTOMER ${customer.id} WAS CREATED`);

    return customer;
  } catch (err) {
    console.error("ERROR CREATING STRIPE CUSTOMER!");
    console.error(err.message);
  }
};

export const calculateOrderAmount = (tier: string) => {
  switch (tier) {
    case "Premium":
      return 2500;
    case "Unlimited":
      return 3500;
    default:
      return 2500;
  }
};

export const chargeCustomer = async (
  customerId: string,
  tier: string
): Promise<void> => {
  console.log("TRYING TO CHARGE CUSTOMER!");

  const params: Stripe.PaymentMethodListParams = {
    customer: customerId,
    type: "card",
  };

  const paymentMethods = await stripe.paymentMethods.list(params);

  try {
    const paymentParams: Stripe.PaymentIntentCreateParams = {
      amount: calculateOrderAmount(tier),
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethods.data[0].id,
      off_session: true,
      confirm: true,
    };
    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create(paymentParams);
  } catch (err) {
    // Error code will be authentication_required if authentication is needed
    console.log("Error code is: ", err.code);
    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
      err.raw.payment_intent.id
    );
    console.log("PI retrieved: ", paymentIntentRetrieved.id);
  }
  console.log("CHARGE CUSTOMER SUCCESS!");
};

export const createPaymentIntent = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("TRYING TO CREATE PAYMENT INTENT!");
  const { tier, phoneNumber }: { tier: string; phoneNumber: string } = req.body;

  try {
    const user: any = await User.find({ phoneNumber: phoneNumber });

    const paymentIntent = await stripe.paymentIntents.create({
      customer: user.stripeId,
      setup_future_usage: "off_session",
      amount: calculateOrderAmount(tier),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      description: tier,
      metadata: {
        order_id: `${uuidv4()}`,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
    console.log("CREATED PAYMENT INTENT!");
  } catch (err) {
    console.error("ERROR CREATING STRIPE PAYMENT INTENT!");
    console.error(err.message);
  }
};
