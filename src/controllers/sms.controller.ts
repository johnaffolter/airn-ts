import express from "express";
import twilio from "twilio";
import { Configuration, OpenAIApi } from "openai";
import SendblueClient from "../sendblue/lib";

import {
  updateUserFromText,
  createNewUserInteraction,
} from "../controllers/users.controller";
import User from "../models/user";

const twiml = twilio.twiml;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const sendblueClient = new SendblueClient(
  process.env.SEND_BLUE_API_KEY,
  process.env.SEND_BLUE_SECRET,
  { logLevel: "debug" }
);

const openai = new OpenAIApi(configuration);

export const post = async (req: express.Request, res: express.Response) => {
  console.log("🚀🚀🚀🚀 ~ file: sms.controller.js:16 ~ post ~ req:", req);
  const twimlMsg = new twiml.MessagingResponse();
  const userRequest = req.body.Body || "";
  const userPhoneNumber = req.body.From;
  console.log(
    "🚀🚀🚀🚀 ~ file: sms.controller.js:14 ~ post ~ req.body:",
    req.body
  );

  const singleUser = await User.findOne({ phoneNumber: userPhoneNumber });

  if (userRequest.trim().length === 0) {
    // twimlMsg.message("Please enter a valid prompt.");
    // res.type("text/xml").send(twimlMsg.toString());
    res.type("text/xml").send(
      sendblueClient.sendMessage({
        number: userPhoneNumber,
        content: "Please enter a valid prompt.",
      })
    );
  } else {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        max_tokens: 3000,
        n: 1,
        messages: [
          { role: "system", content: `You are a helpful life coach.` },
          { role: "user", content: `${userRequest}` },
        ],
        temperature: 0.3,
      });

      const chatGptResponse: string =
        response.data.choices[0].message.content ||
        "No Response From ChatGPT 😔 😔 😔 ";
      console.log(
        "🚀🚀🚀🚀 ~ file: sms.controller.js:44 ~ post ~ chatGptResponse:",
        chatGptResponse
      );
      // TODO: few shot learning logic here then respond after
      res.type("text/xml").send(
        sendblueClient.sendMessage({
          number: userPhoneNumber,
          content: chatGptResponse,
        })
      );
      // twimlMsg.message(chatGptResponse);
      // res.type("text/xml").send(twiml.toString());

      const userInteraction = {
        userPhoneNumber: userPhoneNumber,
        userMessage: userRequest,
        chatGptResponse: chatGptResponse,
        interactionDate: new Date().toString(),
      };

      createNewUserInteraction(userInteraction);
      updateUserFromText(req.body);
    } catch (err) {
      if (err.response) {
        console.error(err.response.status, err.response.data);
        res.type("text/xml").send(
          sendblueClient.sendMessage({
            number: userPhoneNumber,
            content: `${err.response.status + err.response.data}`,
          })
        );
        
        // twimlMsg.message(err.response.status + err.response.data);
        // res.type("text/xml").send(twimlMsg.toString());
      } else {
        console.error(`Error with OpenAI API request: ${err.message}`);
        // twimlMsg.message("An error occurred during your request.");
        // res.type("text/xml").send(twimlMsg.toString());
        res.type("text/xml").send(
          sendblueClient.sendMessage({
            number: userPhoneNumber,
            content: "An error occurred during your request.",
          })
        );
      }
    }
  }
};