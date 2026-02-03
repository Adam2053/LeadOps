import { generateAccessToken, generateRefreshToken } from "./token.js";
import User from "../models/user.model.js"

const sendAuthToken = async (res, user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const currUser = await User.findById(user._id);
    await user.save();
}