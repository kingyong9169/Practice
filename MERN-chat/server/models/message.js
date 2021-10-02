import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    user_image: {
      type: String,
      required: false,
    },
    message_text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export default mongoose.model("message", messageSchema);
