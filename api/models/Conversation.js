const mongoose = require("mongoose");
import Conversation from './../../client/src/components/conversations/Conversation';

const ConversationSchema = new mongoose.Schema(
  {
    members:{type:Array}
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", ConversationSchema)