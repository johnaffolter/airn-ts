import { Schema, model, Document } from 'mongoose';

export interface UserInteractionInterface extends Document {
  userPhoneNumber: {
    type: string,
    required: true,
  },
  userMessage: {
    type: string,
    required: true,
  },
  chatGptResponse: string,
  interactionDate: {
    type: string,
    required: true,
  },
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
});

export default model<UserInteractionInterface>('UserInteraction', UserInteractionSchema);