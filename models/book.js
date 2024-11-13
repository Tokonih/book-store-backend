const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter the book title"],
  },
  description: {
    type: String,
    required: [true, "Please enter the book description"],
  },
  images: {type: String},
  // genre: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Genre",
  //   required: true,
  // },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  publishedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", bookSchema);
