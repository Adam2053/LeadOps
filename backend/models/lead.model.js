import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    expected_value: {
      type: Number,
    },
    stage: {
      type: String,
      enum: ["new", "contacted", "proposal_sent", "won", "lost"],
      required: true,
      default: "new"
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Lead = new mongoose.model("Lead", leadSchema);

export default Lead;
