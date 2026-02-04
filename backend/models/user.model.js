import mongoose from "mongoose";

const ROLES = ["owner", "client"];

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: [6, "Password should be minimum of 6 characters"],
  },
  email: {
    type: String,
    required: true,
  },
  refresh_token: {
    token: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 7,
    },
  },
  role: {
    type: String,
    enum: ROLES,
    required: true,
  },
});

const User = new mongoose.model("User", userSchema);
export default User;
