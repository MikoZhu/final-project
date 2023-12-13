import { UserModel, passwordRegex, emailRegex } from "../models/UserModel";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc Register new user
// @route POST /register
// @access Public

export const registerUserController = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // first condition
    if (!username || !password || !email) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    // second condition
    if (!passwordRegex.test(password)) {
      res.status(400);
      throw new Error(
        "Password must be at least 6 characters and include lowercase, uppercase, and a number."
      );
    }

    // if (!emailRegex.test(email)) {
    //   res.status(400);
    //   throw new Error("Email should be like username@example.com ");
    // }

    // third condition
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      res.status(400);
      throw new Error(
        `User with ${
          existingUser.username === username ? "username" : "email"
        } already exists`
      );
    }
    // genterate a salt and hash the user's passowrd
    // create a random value called "salt."
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // create a new user with the hashed password
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    // save new user instance to the database
    await newUser.save();
    // response with a success message, user details, and the JWT token
    res.status(201).json({
      success: true,
      response: {
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
        accessToken: generateToken(newUser._id),
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, response: e.message });
  }
});

// generate a JWT token for the user authentication
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// @desc Login Existing User
// @route Post /login
// @access Public
export const loginUserController = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      // if no user is found with the provided username, response with 401
      return res
        .status(401)
        .json({ success: false, response: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(402)
        .json({ sucess: false, response: "Incorrect password" });
    }
    res.status(200).json({
      sucess: true,
      response: {
        username: user.username,
        id: user._id,
        accessToken: generateToken(user._id),
      },
    });
  } catch (e) {
    res.status(500).json({ sucess: false, response: e.message });
  }
});

// @desc Get user private page
// @route Get /secret
// @access Private
export const secret = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, response: "Unauthorized" });
    }
    // if authenticated, return user information
    res.status(200).json({ success: true, response: req.user });
  } catch (error) {
    console.error("Error in secret route:", error);
    res.status(500).json({ success: false, response: "Internal Server Error" });
  }
});
