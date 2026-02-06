import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "done", "missed"],
      default: "pending",
    },
    note: {
      type: String,
    },
  },
  { timestamps: true },
);

const FollowUp = new mongoose.model("FollowUp", followUpSchema);

export default FollowUp;
