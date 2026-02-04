import { generateAccessToken, generateRefreshToken } from "./token.js";
import User from "../models/user.model.js";

const sendAuthToken = async (res, user) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await User.findByIdAndUpdate(user._id, {
      refresh_token: refreshToken,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 100,
    });

    return accessToken;
  } catch (e) {
    throw new Error(`${e.message}`);
  }
};

export default sendAuthToken;
