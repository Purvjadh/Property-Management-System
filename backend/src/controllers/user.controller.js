import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create User
const createUser = asyncHandler(async (req, res) => {
    const { username, email, fullName } = req.body;

    // Validate required fields
    if (!username || !email || !fullName) {
        throw new ApiError(400, "All fields (username, email, fullName) are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    // Create user (lowercase handled by schema)
    const user = await User.create({
        username,
        email,
        fullName
    });

    // Fetch created user
    const createdUser = await User.findById(user._id).select("-createdAt updatedAt")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    );
});

// Update User
const updateUserDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fullName, email } = req.body;

    // Validate at least one field is provided
    if (!fullName && !email) {
        throw new ApiError(400, "At least one field (fullName or email) is required to update");
    }

    // Build update object with only allowed fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    // Check if email is being updated and if it already exists
    if (email) {
        const existingUser = await User.findOne({ 
            email: email.toLowerCase(), 
            _id: { $ne: id } // Exclude current user
        });
        
        if (existingUser) {
            throw new ApiError(409, "Email already in use by another user");
        }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-createdAt -updatedAt")

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User updated successfully")
    );
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "User deleted successfully")
    );
});

// Get User
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).select("-createdAt -updatedAt")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    );
});


//get All users

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-createdAt -updatedAt").sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(
            200, 
            users,
            "Users fetched successfully"
        )
    );
});
export { createUser, getUser, updateUserDetails, deleteUser,getAllUsers };