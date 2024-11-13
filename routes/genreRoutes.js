const express = require("express");
const {
  createGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
} = require("../controllers/genreController");

const router = express.Router();

// Create Genre
router.post("/", createGenre);

// Get all genres
router.get("/", getAllGenres);

// Get genre by ID
router.get("/:id", getGenreById);

// Update genre
router.put("/:id", updateGenre);

// Delete genre
router.delete("/:id", deleteGenre);

module.exports = router;
