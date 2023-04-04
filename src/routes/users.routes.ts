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
} from "../controllers/users.controller";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);

usersRouter.get("/interactions", getUserInteractions);

usersRouter.get("/interactions/:id", getSingleUserInteractions);

usersRouter.get("/:id", getSingleUser);

usersRouter.post("/create", createNewUser);

usersRouter.put("/:id", updateSingleUser);

usersRouter.put("/:id/tier", updateUserTierLevel);

usersRouter.delete("/:id", deleteUser);

export default usersRouter;
