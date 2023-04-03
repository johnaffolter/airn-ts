import express from "express";
import { post } from "../controllers/sms.controller";

const smsRouter = express.Router();

smsRouter.post("/", post);

export default smsRouter;
