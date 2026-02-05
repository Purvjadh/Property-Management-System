import { Router } from "express";
import { 
    createUser, 
    getUser, 
    updateUserDetails, 
    deleteUser,
    getAllUsers
} from "../controllers/user.controller.js";

const router = Router();

// Create a new user
router.route("/")
.post(createUser)
.get(getAllUsers);

// Get, Update, Delete user by ID
router.route("/:id")
    .get(getUser)
    .patch(updateUserDetails)
    .delete(deleteUser);

export default router;