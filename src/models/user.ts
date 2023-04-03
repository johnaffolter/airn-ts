import { Schema, model, Document } from "mongoose";

export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  tier: string
  messageCount: number;
  fromCity: string;
  fromState: string;
  fromZip: string;
  signUpDate: string;
  userEmail: string;
  password: string;
  stripeId: string;
}

const UserSchema: Schema = new Schema({
  firstName: String,
  lastName: String,
  phoneNumber: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    required: true,
  },
  messageCount: {
    type: Number,
    required: true,
    default: 0,
  },
  fromCity: String,
  fromState: String,
  fromZip: String,
  signUpDate: String,
  userEmail: String,
  password: String,
  stripeId: {
    type: String,
    required: true,
  },
});

export default model<UserInterface>("User", UserSchema);
