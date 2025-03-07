import userModel from "../models/userModel.js";
import dispatchModel from "../models/dispatchModel.js"; // Import the new dispatch model
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch){
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Checking if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    // Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 5) {
      return res.json({ success: false, message: "Please enter at least 5 character password" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      phoneNumber,
      password: hashedPassword
    });

    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      res.json({ success: true, message: "Admin login successful" });
    } else {
      res.json({ success: false, message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for Dispatch Rider Login
// const dispatchLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const dispatch = await dispatchModel.findOne({ email });

//     if (!dispatch) {
//       return res.json({ success: false, message: "Dispatch rider does not exist" });
//     }

//     const isMatch = await bcrypt.compare(password, dispatch.password);
//     if (isMatch) {
//       const token = createToken(dispatch._id);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, message: "Invalid password" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// Route for Dispatch Rider Login
const dispatchLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const dispatch = await dispatchModel.findOne({ phone });

    if (!dispatch) {
      return res.json({ success: false, message: "Dispatch rider does not exist" });
    }

    const isMatch = await bcrypt.compare(password, dispatch.password);
    if (isMatch) {
      const token = createToken(dispatch._id);
      res.json({ success: true, token, name: dispatch.name, phoneNumber: dispatch.phone });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// Route for Dispatch Rider Registration
const registerDispatch = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, address, dateOfBirth, position } = req.body;

    // Checking if dispatch rider already exists
    const exists = await dispatchModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Dispatch rider already exists" });
    }
    // Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 5) {
      return res.json({ success: false, message: "Please enter at least 5 character password" });
    }

    // Hashing dispatch rider password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDispatch = new dispatchModel({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      address,
      dateOfBirth,
      position
    });

    const dispatch = await newDispatch.save();

    const token = createToken(dispatch._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user forgot password
const forgotPassword = async (req, res) => {
  try {
    console.log("Forgot password function hit");
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You requested a new password. Click the following link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: "Error sending email" });
      }
      res.json({ success: true, message: "Password reset link sent to your email" });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user reset password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    console.log("Reset password function hit");
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user with the matching token and ensure it hasn't expired
    const user = await userModel.findOne({
      _id: decoded.id,
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Token is invalid or has expired" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ success: false, message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ success: false, message: "Invalid token" });
    } else {
      return res.status(500).json({ success: false, message: "An error occurred while processing your request. Please try again later." });
    }
  }
};

export { loginUser, registerUser, adminLogin, dispatchLogin, registerDispatch, forgotPassword, resetPassword };
