import asyncHandler from "express-async-handler";
import { ProfileModel } from "../models/ProfileModel";
import { UserModel } from "../models/UserModel";

// @desc Post user's profile information
// @route POST /profile/:user_id
// @access Private

export const addUserProfileController = asyncHandler(async (req, res) => {
  try {
    // Check if a profile already exists for the user
    const existingProfile = await ProfileModel.findOne({
      user_id: req.user.id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        error: "Profile already exists for this user",
      });
    }
    //find the correct user and the user get the authorization
    const user = await UserModel.findById(req.user.id);
    console.log(user);
    if (!user) {
      res.status(400).json({
        success: false,
        error: "User not found",
      });
    } else {
      const newProfile = new ProfileModel({
        user_id: req.user.id,
        // Add profile fields based on requirements
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        important: req.body.important,
        color: req.body.color,
        flower: req.body.flower,
      });

      // Save the new profile to the database
      await newProfile.save();

      res.status(201).json({ success: true, response: newProfile });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc Update user's profile information
// @route PUT /profile/:user_id
// @access Private
export const updateUserProfileController = asyncHandler(async (req, res) => {
  try {
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { user_id: req.user.id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        important: req.body.important,
        color: req.body.color,
        flower: req.body.flower,
      },
      { new: true } // Return the updated document
    );

    if (!updatedProfile) {
      return res
        .status(404)
        .json({ success: false, response: "Profile not found" });
    }

    res.status(200).json({ success: true, response: updatedProfile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc Get user's profile information
// @route Get /profile/:user_id
// @access Private
export const getUserProfileController = asyncHandler(async (req, res) => {
  //find the user's profile information

  try {
    const userProfiles = await ProfileModel.findOne({ user_id: req.user.id });
    console.log(userProfiles);
    if (!userProfiles) {
      res.status(404).json({ success: false, response: "Profile not found" });
    }

    res.status(200).json({ success: true, response: userProfiles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
