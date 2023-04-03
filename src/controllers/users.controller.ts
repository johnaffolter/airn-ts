import express from "express";
// import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import User from "../models/user";
import UserInteraction from "../models/userInteraction";
import { createStripeCustomer } from "./payments.controller";

interface ReqBody {
  number: string;
}

// const password: string = "mypass123";
// const saltRounds: number = 10;

// bcrypt.genSalt(saltRounds, function (saltError: any, salt) {
//   if (saltError) {
//     throw saltError;
//   } else {
//     bcrypt.hash(password, salt, function (hashError, hash) {
//       if (hashError) {
//         throw hashError;
//       } else {
//         console.log(hash);
//         //$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K
//       }
//     });
//   }
// });

// If you provide a password that matches the
// original password used to create the hash, the following message should be logged:
// const passwordEnteredByUser: string = "mypass123";
// const hash: string =
//   "$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K";

// bcrypt.compare(passwordEnteredByUser, hash, function (error, isMatch) {
//   if (error) {
//     throw error;
//   } else if (!isMatch) {
//     console.log("Password doesn't match!");
//   } else {
//     console.log("Password matches!");
//   }
// });

// const userLogin = async (req: express.Request, res) => {
//   const userEmail = req.body.userEmail;
//   const password = req.body.password;
//   const user: any = await User.findOne({ userEmail: userEmail });
//   User.findOne({ userEmail: userEmail }).exec(function (error, user) {
//     if (error) {
//       callback({ error: true });
//     } else if (!user) {
//       callback({ error: true });
//     } else {
//       user.comparePassword(password, function (matchError, isMatch) {
//         if (matchError) {
//           callback({ error: true });
//         } else if (!isMatch) {
//           callback({ error: true });
//         } else {
//           callback({ success: true });
//         }
//       });
//     }
//   });
// };

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
      })),
    });
    console.log("FETCHED USER INTERACTIONS");
  } catch (err) {
    console.error("ERROR FETCHING USER INTERACTIONS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to load user interactions." });
  }
};

export const updateSingleUser = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("TRYING TO UPDATE USER");
  const userID = req.params.id;
  const userFirstName = req.body.firstName;
  const userLastName = req.body.lastName;
  const userPhoneNumber = req.body.phoneNumber;
  const userTierLevel = req.body.tier;
  const userMessageCount = req.body.messageCount;
  const userFromCity = req.body.fromCity;
  const userFromState = req.body.fromState;
  const userFromZip = req.body.fromZip;
  const userSignUpDate = req.body.signUpDate;
  const userEmail = req.body.userEmail;
  const userStripeId = req.body.stripeId;

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
  console.log("TRYING TO STORE USER");
  const user = new User({
    firstName: req.body.firstName || "N/A",
    lastName: req.body.lastName || "N/A",
    phoneNumber: req.body.phoneNumber || req.body.number,
    tier: "Free",
    messageCount: 0,
    fromCity: req.body.fromCity || "N/A",
    fromState: req.body.fromState || "N/A",
    fromZip: req.body.fromZip || "N/A",
    signUpDate: new Date(),
    userEmail: req.body.userEmail || `${uuidv4()}@life-coach-airn.com`,
    stripeId: req.body.stripeId || "N/A",
  });
  console.log("CREATE NEW USER IN MONGO");

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
        stripeId: user.stripeId,
      },
    });
    console.log("CREATE NEW USER IN MONGO AND STRIPE!");
  } catch (err) {
    console.error("ERROR STORING NEW USER");
    console.error(err.message);
    res.status(500).json({ message: "Failed to save user." });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  console.log("TRYING TO DELETE USER");
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Deleted user!" });
    console.log("DELETED USER");
  } catch (err) {
    console.error("ERROR FETCHING USERS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

export const createNewUserInteraction = async (userInteraction: any) => {
  console.log("TRYING TO STORE USER MESSAGE");
  const { userPhoneNumber, userMessage, chatGptResponse } = userInteraction;

  const newUserInteraction = new UserInteraction({
    userPhoneNumber: userPhoneNumber,
    userMessage: userMessage,
    chatGptResponse: chatGptResponse,
    interactionDate: new Date().toString(),
  });

  try {
    await newUserInteraction.save();
    console.log("STORED NEW USER INTERACTION");
  } catch (err) {
    console.error("ERROR STORING NEW USER INTERACTION");
    console.error(err.message);
  }
};

export const updateOrCreateUserFromText = async (reqBody: ReqBody) => {
  console.log("TRYING TO UPDATE USER FROM TEXT MESSAGE");
  const { number } = reqBody;

  try {
    const user: any = User.findOne({ phoneNumber: number });
    console.log(
      "🚀🚀🚀🚀 ~ file: users.controller.ts:313 ~ updateOrCreateUserFromText ~ user:",
      user || "NO USER"
    );

    if (!user) {
      // create a user
      const user = new User({
        firstName: "N/A",
        lastName: "N/A",
        phoneNumber: number,
        tier: "Free",
        messageCount: 1,
        fromCity: "N/A",
        fromState: "N/A",
        fromZip: "N/A",
        signUpDate: new Date(),
        userEmail: `${uuidv4()}@life-coach-airn.com`,
        stripeId: "N/A",
      });
      const newStripeCustomer: any = createStripeCustomer(user);
      user.stripeId = newStripeCustomer.id;
      const new_user = await user.save();
      console.log("🚀🚀🚀🚀 ~ file: users.controller.ts:329 ~ updateOrCreateUserFromText ~ new_user:", new_user)
      console.log("CREATED NEW USER IN MONGO & STRIPE VIA updateOrCreateUserFromText");
    } else if (!user.stripeId || user.stripeId === "N/A") {
      const newStripeCustomer: any = createStripeCustomer(user);
      user.stripeId = newStripeCustomer.id;
      user.messageCount = user.messageCount += 1;
      const updated_user = await user.save();
      console.log(
        "🚀🚀🚀🚀 ~ file: users.controller.ts:346 ~ updateOrCreateUserFromText ~ STRIPE ID - updated_user:",
        updated_user
      );
      console.log(
        "UPDATED USER MSG COUNT & CREATED STRIPE CUSTOMER FROM TEXT MESSAGE"
      );
    } else {
      user.messageCount = user.messageCount += 1;
      const updated_user = await user.save();
      console.log("🚀🚀🚀🚀 ~ file: users.controller.ts:346 ~ updateOrCreateUserFromText ~ updated_user:", updated_user)
      console.log("UPDATED USER MSG COUNT FROM TEXT MESSAGE");
    }
  } catch (err) {
    console.error("ERROR UPDATING USER FROM TEXT MESSAGE");
    console.error(err.message);
  }
};

export const updateUserTierLevel = async (
  req: express.Request,
  res: express.Response
) => {
  console.log(
    "🚀🚀🚀🚀 ~ file: users.controller.js:150 ~ updateUserTierLevel ~ req:",
    req
  );
  console.log("TRYING TO UPDATE USER TIER LEVEL");
  const userID = req.params.id;
  const userTierLevel = req.body.tier;

  if (!userTierLevel || userTierLevel.trim().length === 0) {
    console.log("INVALID INPUT - NO TEXT");
    return res.status(422).json({ message: "Invalid user info." });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userID },
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
    console.log("UPDATED USER TIER LEVEL");
  } catch (err) {
    console.error("ERROR UPDATING USER TIER LEVEL");
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
