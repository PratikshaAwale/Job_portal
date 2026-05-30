import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// Helper function to set cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'jobseeker',
    });

    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      setTokenCookies(res, accessToken, refreshToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      setTokenCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = '';
      await user.save();
    }

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('jwt', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: new Date(0),
    });

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: new Date(0),
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!refreshTokenCookie) {
      return res.status(401).json({ message: 'Not authorized, no refresh token' });
    }

    const user = await User.findOne({ refreshToken: refreshTokenCookie });

    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err || user._id.toString() !== decoded.id) {
        return res.status(403).json({ message: 'Refresh token expired or invalid' });
      }

      const accessToken = generateAccessToken(user._id);

      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000,
      });

      res.json({ message: 'Token refreshed successfully' });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Forgot Password (generate OTP and send email)
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP before saving to database (optional but recommended for security)
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await user.save();

    // Log OTP to server console in development mode for easy copy-paste during viva/testing
    if (process.env.NODE_ENV === 'development') {
      console.log('\n======================================');
      console.log('=== DEVELOPMENT PASSWORD RESET OTP ===');
      console.log(`Email:    ${user.email}`);
      console.log(`OTP Code: ${otp}`);
      console.log('======================================\n');

      // Save to temp file for automated test runner
      try {
        fs.writeFileSync('temp-otp.txt', otp);
      } catch (fsErr) {
        console.error('Error writing temp-otp.txt:', fsErr.message);
      }
    }

    // Send email
    const message = `You are receiving this email because you (or someone else) requested a password reset. \n\n Your OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP',
        message,
      });

      res.status(200).json({ message: 'Email sent' });
    } catch (err) {
      console.error('Error sending email:', err.message);

      // If in development mode, bypass SMTP failure so the presentation doesn't break!
      if (process.env.NODE_ENV === 'development') {
        console.log('Bypassing SMTP email delivery failure for local development demo.');
        return res.status(200).json({ message: 'Email sent (OTP logged to console)' });
      }

      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset Password (verify OTP and update password)
// @route   PUT /api/auth/resetpassword
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (user.resetPasswordOtp !== hashedOtp || user.resetPasswordOtpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
