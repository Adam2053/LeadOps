import { generateAccessToken, generateRefreshToken } from "./token.js";
import User from "../models/user.model.js";

const sendAuthToken = async (res, user) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log(user);

    const curUser = await User.findByIdAndUpdate(user.id, {
      refresh_token: {
        token: refreshToken,
        createdAt: new Date(),
      },
    });
    console.log(curUser);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 100,
    });

    return accessToken;
  } catch (e) {
    console.log(e.message);
  }
};

export default sendAuthToken;
