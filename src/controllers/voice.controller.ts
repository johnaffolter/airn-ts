import express from "express";
import twilio from "twilio";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const twiml = twilio.twiml

const voiceMsg = new twiml.VoiceResponse()

export const post = async (req: express.Request, res: express.Response) => {
  voiceMsg.say({ voice: "alice" }, "hello world!");

  // Render the response as XML in reply to the webhook request
  res.type("text/xml");
  res.send(voiceMsg.toString());
};

export const welcome = async (req: express.Request, res: express.Response) => {
  const gather = voiceMsg.gather({
    // enhanced: "true",
    speechTimeout: "auto",
    speechModel: "phone_call",
    action: `/api/voice/respond`,
  });

  gather.say("Hello! Welcome to the life coaching hotline! What is your question?");
  console.log("VOICE BOT SAYS: " + gather.toString() + "\n");
  res.send(voiceMsg.toString());
};

export const respond = async (req: express.Request, res: express.Response) => {
  const prompt = req.body["SpeechResult"];
  console.log("USER ASKED: " + prompt + "\n");
  try {
    const response = await generateResponse(prompt);
    voiceMsg.say({ voice: "alice" }, response);
    voiceMsg.pause();
    voiceMsg.say("Thank you for using our service. Good bye!");
    voiceMsg.hangup();
    res.type("text/xml").send(voiceMsg.toString());
  } catch (err) {
    if (err.response) {
      console.error(err.response.status, err.response.data);
      res.type("text/xml").send(voiceMsg.toString());
    } else {
      console.error(`Error with OpenAI API request: ${err.message}`);
      res.type("text/xml").send(voiceMsg.toString());
    }
  }
};

const generateResponse = async (prompt) => {
  try {
    const apiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 3000,
      n: 1,
      messages: [
        { role: "system", content: `You are a helpful life coach.` },
        { role: "user", content: `${prompt}` },
      ],
      temperature: 0.3,
    });
    return apiResponse.data.choices[0].message.content
  } catch (err) {
    console.error(`Error with OpenAI API request: ${err.message}`);
  }
}

