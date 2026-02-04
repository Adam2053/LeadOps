import User from "../models/user.model.js";
import hashPassword from "../utils/hashingPassword.js";
import sendAuthToken from "../utils/sendAuthToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { fullName, userName, password, email, role } = req.body;

    if (!fullName || !userName || !password || !email || !role)
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });

    const hashedPassword = await hashPassword(password);

    const ifExistingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (ifExistingUser)
      return res
        .status(409)
        .json({ success: false, message: "Duplicate user found" });

    const newUser = await User.create({
      fullName,
      email,
      userName,
      password: hashedPassword,
      role,
    });

    if (!newUser)
      return res.status(400).json({
        success: false,
        message: "Failed to save user in the database",
      });

    const accessToken = await sendAuthToken(res, newUser);

    return res.status(201).json({
      success: true,
      message: "User saved successfully",
      access_token: accessToken,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password)
      return res.status(404).json({
        success: false,
        message: "Missing required fields",
      });

    const user = await User.findOne({ userName });

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth)
      return res.status(403).json({
        success: false,
        message: "Password must be correct",
      });

    const accessToken = await sendAuthToken(res, user);

    if (!accessToken)
      return res.status(400).json({
        success: false,
        message: "Error generating access_token",
      });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      access_token: accessToken,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken)
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });

  const user = await User.findOne({
    "refresh_token.token": refreshToken,
  });

  if (!user)
    return res.status(403).json({
      success: false,
      message: "Unauthorised: Invalid or expired token",
    });

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = await sendAuthToken(res, user);

    if (!accessToken)
      return res.status(400).json({
        success: false,
        message: "Unauthorised: Failed to generate token",
      });

    return res.status(200).json({
      success: true,
      message: "Token refresh successful",
      access_token: accessToken,
    });
  } catch (e) {
    await User.findByIdAndUpdate(user._id, {
      refresh_token: null,
    });

    return res.status(403).json({
      success: false,
      message: "Unauthorised: Invalid or expired token",
    });
  }
};
