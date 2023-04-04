import { Schema, model, Document, ObjectId } from "mongoose";

export interface UserInteractionInterface extends Document {
  userPhoneNumber: {
    type: string;
    required: true;
  };
  userMessage: {
    type: string;
    required: true;
  };
  chatGptResponse: string;
  interactionDate: {
    type: string;
    required: true;
  };
  userId: ObjectId;
}

const UserInteractionSchema: Schema = new Schema({
  userPhoneNumber: {
    type: String,
    required: true,
  },
  userMessage: {
    type: String,
    required: true,
  },
  chatGptResponse: String,
  interactionDate: {
    type: String,
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model<UserInteractionInterface>(
  "UserInteraction",
  UserInteractionSchema
);
