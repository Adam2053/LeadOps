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
  refresh_token: {
    type: String,
  },
  role: {
    type: String,
    enum: ROLES,
    required: true,
  },
});

const User = new mongoose.model("User", userSchema);
export default User;
