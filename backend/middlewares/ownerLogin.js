import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const ownerLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const accessToken = authHeader.split(" ")[1];

      req.access_token = accessToken;

      if (!accessToken)
        return res.status(403).json({
          success: false,
          message: "Forbidden: Invalid or expired token",
        });

      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      if (!decoded)
        return res.status(403).json({
          success: true,
          message: "Forbidden: No user found",
        });

      const user = await User.findById(decoded.id);

      if (!user || user.role !== "owner")
        return res.status(403).json({
          success: true,
          message: "Forbidden: User not authorised",
        });

      req.user = user._id;

      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      success: false,
      message: "Forbidden; Token is invalid or expired",
    });
  }
};

export default ownerLogin;
