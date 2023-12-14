import { UserModel } from "../models/UserModel";
import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
  let accessToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ){
    try {
      // Get token from header
      accessToken = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;

        next();
      } else {
        res.status(400).json({ sucess: false, response: "Please log in" });
      }
    } catch (e) {
      res.status(500).json({ sucess: false, response: e.message });
    }
  }else{
    res.status(401).json({ success: false, response: "Missing authorization token"});
  }
};
