const User = require("../models/user");
const Book = require("../models/book");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Read All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Read Single User
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("readBooks")
      .select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 12);

    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Upload Profile Image
exports.updateProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res
      .status(200)
      .json({ success: true, data: { profileImage: user.profileImage } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add Book to Read List
exports.addReadBook = async (req, res) => {
    try {
      const user = await User.findById(req.user.id); 
      const { bookId } = req.body;
  
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
  
      // Check if the book exists
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ success: false, error: "Book not found" });
      }
  
     
      if (!user.readBooks.includes(bookId)) {
        user.readBooks.push(bookId); 
        await user.save(); 
      }
  
      // Return the updated list of read books
      res.status(200).json({
        success: true,
        data: user.readBooks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };


exports.getCurrentUser = async (req, res) => {
    try {

      const user = await User.findById(req.user.id) 
        .populate("readBooks") 
        .select("-password");  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Return the user data (without password)
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  