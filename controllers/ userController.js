require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";
const JWT_EXPIRES_IN = "1h";

// Register user function
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    let validationErrors = [];

    if (!firstName) validationErrors.push('First name is required');
    if (!lastName) validationErrors.push('Last name is required');
    if (!email) validationErrors.push('Email is required');
    if (!password) validationErrors.push('Password is required');

    if (validationErrors.length > 0) {
      return res.status(200).json({
        success: false,
        message: 'Validation Failed',
        errors: validationErrors,
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(200).json({
        success: false,
        message: 'Validation Failed',
        errors: ['User with this email already exists'],
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: 'Successfully Registered',
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({
      success: false,
      message:
        'Server Error: Unable to process your request at the moment. Please try again later.',
    });
  }
};

// Login user function
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "Validation Failed",
        errors: ["Email and password are required"],
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to process your request at the moment. Please try again later.",
    });
  }
};

exports.userProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed, token missing",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error during getting user data:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to process your request at the moment. Please try again later.",
    });
  }
};
