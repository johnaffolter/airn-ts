import express from "express";
import { createPaymentIntent } from "../controllers/payments.controller";

const paymentsRouter = express.Router();

paymentsRouter.post("/create-payment-intent", createPaymentIntent);

export default paymentsRouter;
