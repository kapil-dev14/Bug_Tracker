import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

// Helper: Hash password
export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};

// Helper: Verify password
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Generate Access and Refresh Tokens
export const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User does not exist");

    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generating access and refresh tokens");
  }
};

// Register Service
export const registerUserService = async ({
  username,
  email,
  fullname,
  password,
  role,
}) => {
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullname,
    password: hashedPassword,
    role: role || "Developer",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return createdUser;
};

// Login Service
export const loginUserService = async ({ email, username, password }) => {
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  return { user: loggedInUser, accessToken, refreshToken };
};
