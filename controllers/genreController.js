const Genre = require("../models/genre");

// Create a new genre
exports.createGenre = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).json({ success: false, message: "Genre already exists" });
    }

    const genre = new Genre({ name, description });
    await genre.save();
    res.status(201).json({ success: true, message: "Genre created successfully", data: genre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all genres
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json({ success: true, data: genres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single genre by ID
exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      return res.status(404).json({ success: false, message: "Genre not found" });
    }
    res.status(200).json({ success: true, data: genre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a genre
exports.updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!genre) {
      return res.status(404).json({ success: false, message: "Genre not found" });
    }
    res.status(200).json({ success: true, message: "Genre updated successfully", data: genre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a genre
exports.deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      return res.status(404).json({ success: false, message: "Genre not found" });
    }
    res.status(200).json({ success: true, message: "Genre deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
