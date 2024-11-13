const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
  updateProfileImage,
  addReadBook,
} = require("../controllers/userCountroller");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {login} = require("../controllers/authController")
const router = express.Router();

// Create User
router.post("/register", createUser);

// login  User
router.post("/login", login);

// Read All Users
router.get("/", getAllUsers);

// Read Single User by ID
router.get("/:id", getUserById);

// Update User by ID
router.put("/:id", updateUser);

// Delete User by ID
router.delete("/:id", deleteUser);

// Get Current User
router.get("/me", protect, getCurrentUser);

// Update Profile Image for Current User
router.post("/me/profile-image", protect, upload.single("profileImage"), updateProfileImage);

// Add Read Book for Current User
router.post("/add-read-book", protect, addReadBook);

module.exports = router;
