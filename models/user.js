const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  about: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 6,
  },
  profileImage: {
    type: String, 
  },
  role: {
    type: String,
    enum: ["author"], 
    default: "author", 
  },
  readBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",  
    },
  ],
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.password === undefined)
    return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    return next(error); // If there's an error during hashing, pass it to the next middleware
  }
});

// Password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
