import { Schema, model, Document } from "mongoose";

export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: {
    type: string,
    unique: [true, "Phone Number Exist"],
  };
  tier: string
  messageCount: number;
  fromCity: string;
  fromState: string;
  fromZip: string;
  signUpDate: string;
  userEmail: {
    type: string,
    unique: [true, "Email Exist"],
  };
  password: string;
  stripeId: string;
}

const UserSchema: Schema = new Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  tier: String,
  messageCount: Number,
  fromCity: String,
  fromState: String,
  fromZip: String,
  signUpDate: String,
  userEmail: String,
  password: String,
  stripeId: String,
});

export default model<UserInterface>("User", UserSchema);
