import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    // Validation: Check if all fields are filled
    if (!username || !email || !password){
        throw new Error("Please fill all the inputs.");
    }

    // Validation: Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password;

    // Validation: Username length (3-30 characters)
    if (trimmedUsername.length < 3) {
        throw new Error("Username must be at least 3 characters long.");
    }
    if (trimmedUsername.length > 30) {
        throw new Error("Username must not exceed 30 characters.");
    }

    // Validation: Username format (allow letters, numbers, underscores, hyphens and spaces between names)
    const usernameRegex = /^[a-zA-Z0-9 _-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
        throw new Error("Username can only contain letters, numbers, spaces, underscores, and hyphens.");
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        throw new Error("Please provide a valid email address.");
    }

    // Validation: Password length (minimum 6 characters)
    if (trimmedPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
    }

    // Validation: Password strength (must include at least one of: number, lowercase, or uppercase)
    if (!(/[0-9]/.test(trimmedPassword) || /[a-z]/.test(trimmedPassword) || /[A-Z]/.test(trimmedPassword))) {
        throw new Error("Password must contain at least one number, lowercase letter, or uppercase letter.");
    }

    const userExists = await User.findOne({ email: trimmedEmail });
    if(userExists) res.status(400).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    const newUser = new User({username: trimmedUsername, email: trimmedEmail, password: hashedPassword});

    try {
      await newUser.save();
      createToken(res, newUser._id);

      res
        .status(201)
        .json({
          _id: newUser._id, 
          username: newUser.username, 
          email: newUser.email,
          isAdmin: newUser.isAdmin,
        });
    } catch (error) {
      res.status(400);
      throw new Error("Invalid user data");  
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (isPasswordValid) {
            createToken(res, existingUser._id);

            res.status(201).json({
                _id: existingUser._id, 
                username: existingUser.username, 
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
            });
            return;
        }
    }

});


const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({message: "Logged out successfully"});
}); 

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });        
    } else {
        res.status(404);
        throw new Error("User not found.");
    }

});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Validate and apply username if provided
        if (req.body.username) {
            const trimmedUsername = req.body.username.trim();

            if (trimmedUsername.length < 3) {
                throw new Error("Username must be at least 3 characters long.");
            }
            if (trimmedUsername.length > 30) {
                throw new Error("Username must not exceed 30 characters.");
            }
            const usernameRegex = /^[a-zA-Z0-9 _-]+$/;
            if (!usernameRegex.test(trimmedUsername)) {
                throw new Error("Username can only contain letters, numbers, spaces, underscores, and hyphens.");
            }

            user.username = trimmedUsername;
        }

        // Validate and apply email if provided
        if (req.body.email) {
            const trimmedEmail = req.body.email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                throw new Error("Please provide a valid email address.");
            }
            user.email = trimmedEmail;
        }

        // Validate and apply password if provided
        if (req.body.password) {
            const trimmedPassword = req.body.password;
            if (trimmedPassword.length < 6) {
                throw new Error("Password must be at least 6 characters long.");
            }
            if (!(/[0-9]/.test(trimmedPassword) || /[a-z]/.test(trimmedPassword) || /[A-Z]/.test(trimmedPassword))) {
                throw new Error("Password must contain at least one number, lowercase letter, or uppercase letter.");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(trimmedPassword, salt);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});

const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Cannot delete admin user");
        }

        await User.deleteOne({_id: user._id});
        res.json({message: "User removed"});
    } else {
        res.status(400);
        throw new Error("User not found.");
    }

});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.json(user);
    } else {
        res.status(400);
        throw new Error("User not found");
    }

});

const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Validate and apply username if provided
        if (req.body.username) {
            const trimmedUsername = req.body.username.trim();

            if (trimmedUsername.length < 3) {
                throw new Error("Username must be at least 3 characters long.");
            }
            if (trimmedUsername.length > 30) {
                throw new Error("Username must not exceed 30 characters.");
            }
            const usernameRegex = /^[a-zA-Z0-9 _-]+$/;
            if (!usernameRegex.test(trimmedUsername)) {
                throw new Error("Username can only contain letters, numbers, spaces, underscores, and hyphens.");
            }

            user.username = trimmedUsername;
        }

        // Validate and apply email if provided
        if (req.body.email) {
            const trimmedEmail = req.body.email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmedEmail)) {
                throw new Error("Please provide a valid email address.");
            }
            user.email = trimmedEmail;
        }

        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }

});

export { 
    createUser, 
    loginUser, 
    logoutCurrentUser, 
    getAllUsers, 
    getCurrentUserProfile,
    updateCurrentUserProfile, 
    deleteUserById,
    getUserById,
    updateUserById,
};