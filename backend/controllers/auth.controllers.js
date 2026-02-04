import User from "../models/user.model.js";
import hashPassword from "../utils/hashingPassword.js";
import sendAuthToken from "../utils/sendAuthToken.js";

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

    const userPayload = {
      id: newUser._id,
      fullName,
      email,
      userName,
    };

    const accessToken = await sendAuthToken(res, userPayload);

    return res.status(201).json({
      success: true,
      message: "User saved successfully",
      access_token: accessToken,
      data: userPayload,
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

    const userPayload = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      userName: user.userName,
    };

    const accessToken = await sendAuthToken(res, userPayload);

    if (!accessToken)
      return res.status(400).json({
        success: false,
        message: "Error generating access_token",
      });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      access_token: accessToken,
      data: userPayload,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const refresh = async (req, res) => {};
