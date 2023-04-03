import express from "express";
import { post, welcome, respond } from "../controllers/voice.controller";

const voiceRouter = express.Router();

voiceRouter.post("/", post);

voiceRouter.post("/welcome", welcome);

voiceRouter.post("/respond", respond);

export default voiceRouter;
