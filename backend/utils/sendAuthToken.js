import { generateAccessToken, generateRefreshToken } from "./token.js";
import User from "../models/user.model.js";

const sendAuthToken = async (res, user) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await User.findByIdAndUpdate(user._id, {
      refresh_token: {
        token: refreshToken,
        createdAt: new Date(),
      },
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return accessToken;
  } catch (e) {
    console.log("Send Auth Token Error: ",e);
    return null;
  }
};

export default sendAuthToken;
