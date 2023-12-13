import mongoose from "mongoose";

const { Schema } = mongoose;

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S]{6,}$/;
// export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
    },
    password: {
      type: String,
      required: true,
      // validate: {
      //   validator: (password) => passwordRegex.test(password),
      //   message:
      //     "Password must be at least 6 characters and include lowercase, uppercase, and a number.",
      // },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => emailRegex.test(email),
        message: "Invalid email format.",
      },
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
