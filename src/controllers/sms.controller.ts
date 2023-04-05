import express from "express";
// import twilio from "twilio";
import { Configuration, OpenAIApi } from "openai";
import SendblueClient from "../sendblue/lib";

import {
  updateUserMsgCount,
  createNewUserInteraction,
  createNewUser,
  checkMessageCount,
} from "../controllers/users.controller";
import User from "../models/user";

// const twiml = twilio.twiml;

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
  // const twimlMsg = new twiml.MessagingResponse();
  const userRequest = req.body.content || "";
  const userPhoneNumber = req.body.number;
  const query = User.where({ phoneNumber: userPhoneNumber });
  const user = await query.findOne();

  if (!user) {
    res.type("text/xml").send(
      sendblueClient.sendMessage({
        number: userPhoneNumber,
        content: "Please visit Enter_link_to_website to sign up",
      })
    );
  }
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
      if (checkMessageCount(user)) {
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
          userId: user._id,
        };

        createNewUserInteraction(userInteraction);
        updateUserMsgCount(userPhoneNumber);
      } else {
        res.type("text/xml").send(
          sendblueClient.sendMessage({
            number: userPhoneNumber,
            content: "Reached message limit. Please purchase a higher plan",
          })
        );
      }
    } catch (err) {
      if (err.response) {
        console.error(err.response.status, err.response.data);
        sendblueClient.sendMessage({
          number: userPhoneNumber,
          content: `${err.response.status + err.response.data}`,
        });
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
