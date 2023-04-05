import express from "express";
import bcrypt from "bcryptjs";
import { jsonwebtoken as jwt } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import User from "../models/user";
import UserInteraction from "../models/userInteraction";
import { createStripeCustomer } from "./payments.controller";

export const userSignUp = (req: express.Request, res: express.Response) => {
  const { password, userEmail, phoneNumber } = req.body;
  bcrypt
    .hash(password, 10)
    .then(async (hashedPassword) => {
      // find a user from db
      const user = await User.findOne({ phoneNumber: phoneNumber });
      if (user) {
        user.password = hashedPassword;
        user.userEmail = userEmail;
        user
          .save()
          .then((result) => {
            res.status(201).send({
              message: "User Password Updated Successfully",
              result,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Error creating user",
              error,
            });
          });
      } else {
        const new_user = await createNewUser(req, res);
        new_user.password = hashedPassword;
        user.userEmail = userEmail;
        user
          .save()
          .then((result) => {
            res.status(201).send({
              message: "User Password Created Successfully",
              result,
            });
          })
          .catch((error) => {
            res.status(500).send({
              message: "Error creating user password",
              error,
            });
          });
      }
    })
    .catch((e) => {
      res.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
};

export const userLogin = async (
  req: express.Request,
  res: express.Response
) => {
  const { userEmail, password } = req.body;
  console.log(
    "🚀🚀🚀🚀 ~ file: users.controller.ts:98 ~ userLogin ~ password:",
    password
  );
  User.findOne({ userEmail: userEmail })
    .then(async (user) => {
      console.log(
        "🚀🚀🚀🚀 ~ file: users.controller.ts:101 ~ .then ~ user:",
        user.password
      );
      await bcrypt
        .compare(password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res.status(400).send({
              message: "Password Check does not match",
              Error,
            });
          }
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.userEmail,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
          res.status(200).send({
            message: "Login Successful",
            userEmail: user.userEmail,
            token,
          });
        })
        .catch((Error) => {
          res.status(400).send({
            message: "Passwords do not match",
            Error,
          });
        });
    })
    .catch((error) => {
      res.status(404).send({
        message: "Email not found",
        error,
      });
    });
};

export const getUsers = async (req: express.Request, res: express.Response) => {
  console.log("TRYING TO FETCH USERS!");
  try {
    const users = await User.find();
    res.status(200).json({
      users: users.map((user) => ({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        tier: user.tier,
        messageCount: user.messageCount,
        fromCity: user.fromCity || "N/A",
        fromState: user.fromState || "N/A",
        fromZip: user.fromZip || "N/A",
        signUpDate: user.signUpDate || "No Sign Up Date",
        userEmail: user.userEmail || "N/A",
        password: "Password not shown",
        stripeId: user.stripeId || "N/A",
      })),
    });
    console.log("FETCHED USERS");
  } catch (err) {
    console.error("ERROR FETCHING USERS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to load users." });
  }
};

export const getSingleUser = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("TRYING TO FETCH SINGLE USER!");
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
    console.log("FETCHED SINGLE USER!");
  } catch (err) {
    console.error("ERROR FETCHING SINGLE USER");
    console.error(err.message);
    res.status(500).json({ message: "Failed to load single user." });
  }
};

export const getSingleUserByPhoneNumber = async (phoneNumber: string) => {
  console.log("TRYING TO FETCH SINGLE USER!");
  try {
    const user = await User.findOne({ phoneNumber: phoneNumber });
    console.log("FETCHED SINGLE USER!");
    return user;
  } catch (err) {
    console.error("ERROR FETCHING SINGLE USER");
    console.error(err.message);
  }
};

export const getUserInteractions = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("TRYING TO FETCH USER INTERACTIONS!");
  try {
    const userInteractions = await UserInteraction.find();
    res.status(200).json({
      userInteractions: userInteractions.map((interaction) => ({
        interactionId: interaction._id,
        userPhoneNumber: interaction.userPhoneNumber,
        userMessage: interaction.userMessage,
        chatGptResponse: interaction.chatGptResponse,
        interactionDate: interaction.interactionDate,
        userId: interaction.userId,
      })),
    });
    console.log("FETCHED USER INTERACTIONS");
  } catch (err) {
    console.error("ERROR FETCHING USER INTERACTIONS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to load user interactions." });
  }
};

export const getSingleUserInteractions = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("TRYING TO FETCH SINGLE USER'S INTERACTIONS!");
  try {
    const usersInteractions = await UserInteraction.find({
      userId: req.params.id,
    });
    console.log(
      "🚀🚀🚀🚀 ~ file: users.controller.ts:156 ~ usersInteractions:",
      usersInteractions
    );
    res.status(200).json({
      usersInteractions: usersInteractions.map((interaction) => ({
        userPhoneNumber: interaction.userPhoneNumber,
        userMessage: interaction.userMessage,
        chatGptResponse: interaction.chatGptResponse,
        interactionDate: interaction.interactionDate,
        userId: interaction.userId,
      })),
    });
    console.log("FETCHED SINGLE USER'S INTERACTIONS!");
  } catch (err) {
    console.error("ERROR FETCHING SINGLE USER'S INTERACTIONS!");
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Failed to load single user's interactions." });
  }
};

export const updateSingleUser = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("TRYING TO UPDATE USER");
  const userID = req.params.id || "N/A";
  const userFirstName = req.body.firstName || "N/A";
  const userLastName = req.body.lastName || "N/A";
  const userPhoneNumber = req.body.phoneNumber || "N/A";
  const userTierLevel = req.body.tier;
  const userMessageCount = req.body.messageCount;
  const userFromCity = req.body.fromCity || "N/A";
  const userFromState = req.body.fromState || "N/A";
  const userFromZip = req.body.fromZip || "N/A";
  const userSignUpDate = req.body.signUpDate || "N/A";
  const userEmail = req.body.userEmail || "N/A";
  const userPassword = req.body.password || "N/A";
  const userStripeId = req.body.stripeId || "N/A";

  if (!userTierLevel || userTierLevel.trim().length === 0) {
    console.log("INVALID INPUT - NO TEXT OR MISSING FIELDS");
    return res.status(422).json({ message: "Invalid user info." });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userID },
      {
        firstName: userFirstName,
        lastName: userLastName,
        phoneNumber: userPhoneNumber,
        tier: userTierLevel,
        messageCount: userMessageCount,
        fromCity: userFromCity,
        fromState: userFromState,
        fromZip: userFromZip,
        signUpDate: userSignUpDate,
        userEmail: userEmail,
        password: userPassword,
        stripeId: userStripeId,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Updated user!",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        tier: user.tier,
        messageCount: user.messageCount,
        fromCity: user.fromCity,
        fromState: user.fromState,
        fromZip: user.fromZip,
        signUpDate: user.signUpDate,
        userEmail: user.userEmail,
        password: "password not shown",
        stripeId: user.stripeId,
      },
    });
    console.log("UPDATED USER");
  } catch (err) {
    console.error("ERROR UPDATING USER");
    console.error(err.message);
    res.status(500).json({ message: "Failed to update user." });
  }
};

export const createNewUser = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("💾💾 TRYING TO CREATE A NEW USER");
  const user = new User({
    firstName: req.body.firstName || "N/A",
    lastName: req.body.lastName || "N/A",
    phoneNumber: req.body.number || req.body.phoneNumber,
    tier: "Free",
    messageCount: 0,
    fromCity: req.body.fromCity || "N/A",
    fromState: req.body.fromState || "N/A",
    fromZip: req.body.fromZip || "N/A",
    signUpDate: new Date(),
    userEmail: req.body.userEmail || `${uuidv4()}@life-coach-airn.com`,
    password: "N/A",
    stripeId: req.body.stripeId || "N/A",
  });
  console.log("💾💾 CREATED NEW USER IN MONGO NOW TRYING STRIPE");
  try {
    const newStripeCustomer = await createStripeCustomer(user);
    user.stripeId = newStripeCustomer.id;
    await user.save();
    res.status(201).json({
      message: "User Created",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        tier: user.tier,
        messageCount: user.messageCount,
        fromCity: user.fromCity,
        fromState: user.fromState,
        fromZip: user.fromZip,
        signUpDate: user.signUpDate,
        userEmail: user.userEmail,
        password: "password not shown",
        stripeId: user.stripeId,
      },
    });
    console.log("💾💾 CREATE NEW USER IN MONGO AND STRIPE!");
    return user;
  } catch (err) {
    console.error("💾💾 ERROR STORING NEW USER");
    console.error(err.message);
    res.status(500).json({ message: "Failed to save user." });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("💾💾 TRYING TO DELETE USER");
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Deleted user!" });
    console.log("💾💾 DELETED USER");
  } catch (err) {
    console.error("💾💾 ERROR FETCHING USERS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

export const createNewUserInteraction = async (userInteraction: any) => {
  console.log("💾💾 TRYING TO STORE NEW USER INTERACTION");
  const { userPhoneNumber, userMessage, chatGptResponse, userId } =
    userInteraction;

  const newUserInteraction = new UserInteraction({
    userPhoneNumber: userPhoneNumber,
    userMessage: userMessage,
    chatGptResponse: chatGptResponse,
    interactionDate: new Date().toString(),
    userId: userId,
  });

  try {
    await newUserInteraction.save();
    console.log("💾💾 STORED NEW USER INTERACTION");
  } catch (err) {
    console.error("💾💾 ERROR STORING NEW USER INTERACTION");
    console.error(err.message);
  }
};

export const updateUserMsgCount = async (phoneNumber: string) => {
  console.log("💾💾 TRYING TO UPDATE USER MSG COUNT");
  try {
    const user = await User.findOneAndUpdate(
      { phoneNumber: phoneNumber },
      { $inc: { messageCount: 1 } },
      {
        new: true,
      }
    );
    console.log("💾💾 UPDATED USER MSG COUNT");
  } catch (err) {
    console.error("💾💾 ERROR UPDATING USER MESSAGE COUNT");
    console.error(err.message);
  }
};

export const updateUserTierLevel = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("💾💾 TRYING TO UPDATE USER TIER LEVEL");
  const userId = req.params.id;
  const userTierLevel = req.body.tier;

  if (!userTierLevel || userTierLevel.trim().length === 0) {
    console.log("💾💾 INVALID INPUT - NO TEXT");
    return res.status(422).json({ message: "Invalid user info." });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        tier: userTierLevel,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Updated user tier level!",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        tier: user.tier,
        messageCount: user.messageCount,
        fromCity: user.fromCity,
        fromState: user.fromState,
        fromZip: user.fromZip,
        signUpDate: user.signUpDate,
        userEmail: user.userEmail,
        stripeId: user.stripeId,
      },
    });
    console.log("💾💾 UPDATED USER TIER LEVEL");
  } catch (err) {
    console.error("💾💾 ERROR UPDATING USER TIER LEVEL");
    console.error(err.message);
    res.status(500).json({ message: "Failed to update user tier level." });
  }
};

export const checkMessageCount = (user: any): boolean => {
  const { messageCount, tier }: { messageCount: number; tier: string } = user;

  switch (true) {
    case messageCount > 10 && tier === "Free":
      return false;
    case messageCount > 25 && tier === "Premium":
      return false;
    case tier === "Unlimited":
      return true;
    default:
      return true;
  }
};
