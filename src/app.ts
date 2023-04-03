import express, { Express } from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import morgan from "morgan";
import { connect } from "mongoose";

import usersRouter from "./routes/users.routes";
import smsRouter from "./routes/sms.routes";
import voiceRouter from "./routes/voice.routes";
import paymentsRouter from "./routes/payments.routes";

dotenv.config();

const app: Express = express();
const PORT: number = 80;

app.use(morgan("dev"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/api/users", usersRouter);

app.use("/api/sms", smsRouter);

app.use("/api/voice", voiceRouter);

app.use("/api/payments", paymentsRouter);

app.get("/", (req: express.Request, res: express.Response) => {
  const filePath = path.join(__dirname, "views", "welcome.html");
  res.sendFile(filePath);
});

async function connectToMongoDB() {
  try {
    if (
      await connect(
        `mongodb+srv://${process.env.MONGODB_USERNAME_CHATGPT_MVP}:${process.env.MONGODB_PASSWORD_CHATGPT_MVP}@${process.env.MONGODB_URL_CHATGPT_MVP}/?retryWrites=true&w=majority`
      )
    ) {
      console.log("🚀🚀🚀🚀 - CONNECTED TO MONGODB!!");
    }
  } catch (err) {
    console.error("🚀🚀🚀🚀 ~ file: app.ts:67 ~ connectToMongoDB ~ err:", err);
    console.error("FAILED TO CONNECT TO MONGODB!!");
  }
}

connectToMongoDB();

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
