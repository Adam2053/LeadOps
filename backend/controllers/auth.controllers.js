import User from "../models/user.model.js";
import hashPassword from "../utils/hashingPassword.js";

export const register = async (req, res) => {
  try {
    const { fullName, userName, password, email, role } = req.body;

    if (!fullName || !userName || !password || !email || !role)
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });

    const hashedPassword = hashPassword(password);

    const ifExistingUser = await User.find({ email });

    if (ifExistingUser)
      return res
        .status(409)
        .json({ success: false, message: "Duplicate user found" });

    const newUser = await new User.create({
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

    return res.status(201).json({
      success: true,
      message: "User saved successfully",
      access_token: accessToken,
      data: newUser,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {};

export const refresh = async (req, res) => {};
