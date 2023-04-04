import express from "express";
import {
  getUsers,
  getUserInteractions,
  getSingleUserInteractions,
  getSingleUser,
  createNewUser,
  updateSingleUser,
  updateUserTierLevel,
  deleteUser,
  userSignUp,
  userLogin
} from "../controllers/users.controller";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);

usersRouter.get("/interactions", getUserInteractions);

usersRouter.get("/interactions/:id", getSingleUserInteractions);

usersRouter.get("/:id", getSingleUser);

usersRouter.post("/create", createNewUser);

usersRouter.post("/signup", userSignUp)

usersRouter.post("/login", userLogin)

usersRouter.put("/:id", updateSingleUser);

usersRouter.put("/:id/tier", updateUserTierLevel);

usersRouter.delete("/:id", deleteUser);

export default usersRouter;
