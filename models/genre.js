const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a genre name"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Genre", genreSchema);
