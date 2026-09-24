// Importing model
const User = require("../models/User");

// Importing Item model
const Item = require("../models/Item");

// Importing bcrypt
const bcrypt = require("bcrypt");

// Importing mongoose
const mongoose = require("mongoose");

// Importing jwt
const jwt = require("jsonwebtoken");

// email regex to test emails
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Importing environment variables
require("dotenv").config();

// Defining Route Handlers
exports.signup = async (req, res) => {
  try {
    // fetch data
    const { email, password } = req.body;

    // check
    if (!email || !password || !password.trim() || !email.trim())
      return res.status(400).json({
        success: false,
        message: "Please fill all the required details.",
      });

    if (!emailRegex.test(email))
      return res.status(400).json({
        success: false,
        message: "Please enter valid email id.",
      });

    // checking isn't user already registered
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "User already registered.",
      });

    // hash the password before storing it in db
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Try again after some time.",
      });
    }

    if (!hashedPassword)
      return res.status(500).json({
        success: false,
        message: "Try again after some time.",
      });

    // saving entry in db
    const savedUser = await User.create({ email, password: hashedPassword });
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "SignUp : Internal Server Error!",
    });
  }
};

exports.login = async (req, res) => {
  try {
    // fetch data
    const { email, password } = req.body;

    // check
    if (!email || !password || !password.trim() || !email.trim())
      return res.status(400).json({
        success: false,
        message: "Please fill all the required details.",
      });

    if (!emailRegex.test(email))
      return res.status(400).json({
        success: false,
        message: "Please enter valid email id.",
      });

    // checking user already registered or not
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({
        success: false,
        message: "Signup first.",
      });

    // compare password
    if (await bcrypt.compare(password, existingUser.password)) {
      // means the password matched, so generate cookie and hand it to user
      const payload = {
        id: existingUser._id,
        email: existingUser.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      const secureCookie = process.env.COOKIE_SECURE === "true";
      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 7200000,
          sameSite: secureCookie ? "none" : "lax",
          secure: secureCookie,
        })
        .json({
          success: true,
          message: "User logged in successfully.",
          user: { email: existingUser.email },
        });
    }

    res.status(401).json({
      success: false,
      message: "Please enter valid password.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Login : Internal Server Error!",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const secureCookie = process.env.COOKIE_SECURE === "true";
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: secureCookie ? "none" : "lax",
      secure: secureCookie,
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Logout : Internal Server Error!",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    return res.status(200).json({
      success: true,
      user: { email: user.email },
      message: "User fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Get Me : Internal Server Error!",
    });
  }
};

exports.getCollection = async (req, res) => {
  try {
    // fetch user id from the decoded JWT payload
    const userId = req.user.id;

    // check
    if (!userId)
      return res.status(401).json({
        success: false,
        message: "Login again.",
      });

    if (!mongoose.isValidObjectId(userId))
      return res.status(401).json({
        success: false,
        message: "Invalid user id.",
      });

    // check user exists or not
    const existingUser = await User.findById(userId)
      .populate("collection")
      .exec();

    if (!existingUser)
      return res.status(401).json({
        success: false,
        message: "User does not exists.",
      });

    return res.status(200).json({
      success: true,
      data: existingUser.collection,
      message: "Collection fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Get Collection : Internal Server Error!",
    });
  }
};

exports.addToCollection = async (req, res) => {
  try {
    // fetch data from request body
    const { id, type, src, thumbnail, title, author, meta, format } = req.body;
    const userId = req.user.id;

    // validate required fields
    if (!id || !type || !src || !title || !author || !meta || !format)
      return res.status(400).json({
        success: false,
        message: "Please provide all required item details.",
      });

    // check if user exists
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    // check if item already exists in the database
    let item = await Item.findOne({ id, type });

    if (!item) {
      // create new item if it doesn't exist
      item = await Item.create({
        id,
        type,
        src,
        thumbnail,
        title,
        author,
        meta,
        format,
      });
    }

    // check if item is already in user's collection
    if (user.collection.includes(item._id))
      return res.status(400).json({
        success: false,
        message: "Item already in collection.",
      });

    // add item to user's collection
    user.collection.push(item._id);
    await user.save();

    return res.status(201).json({
      success: true,
      data: item,
      message: "Item added to collection successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Add to collection : Internal Server Error!",
    });
  }
};

exports.removeFromCollection = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // check if user exists
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    // find the item by its custom 'id' field (not MongoDB _id)
    const item = await Item.findOne({ id: itemId });
    if (!item)
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });

    // remove item from user's collection
    const index = user.collection.findIndex((collectionItemId) =>
      collectionItemId.equals(item._id),
    );
    if (index === -1)
      return res.status(400).json({
        success: false,
        message: "Item not in collection.",
      });

    user.collection.splice(index, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from collection successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Remove from collection : Internal Server Error!",
    });
  }
};

exports.clearCollection = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    user.collection = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Collection cleared successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Clear collection : Internal Server Error!",
    });
  }
};
