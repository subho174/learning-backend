const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const User = require("../models/user.models");

const verifyJWT = asyncHandler(async (req, _, next) => { // if res is blank _ can be written in place of that
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", ""); // if not found through cookies then going with header
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    
    // verifying token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // finding user
    const user = await User.findById(
        decodedToken?._id
      ).select("-password");
      
    if (!user) throw new ApiError(401, "Invalid Access Token");
    // storing user data in req
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

module.exports = { verifyJWT };
