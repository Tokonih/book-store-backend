// routes/bookRoutes.js
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/roleMiddleware");
const {
  createBook,
  addReview,
  getAllBooks,
  getBook,
  editBook,
  deleteBook,
} = require("../controllers/bookController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Route for authors to create books with multiple images
router.post(
  "/create",
  protect,
  checkRole(["author"]),
  createBook
);

const { getAuthorById } = require("../controllers/bookController");

router.get("/author/:id", getAuthorById);

// Route for users to add reviews
router.post("/:bookId/review", protect, addReview);

router.get("/books", getAllBooks);
router.get("/", getAllBooks);

// Public route to get a single book by ID
router.get("/:id", getBook);

// Protected route to edit a book (only author or admin can edit)
router.put("/:id", protect, checkRole("author", "admin"), editBook);

// Protected route to delete a book (only author or admin can delete)
router.delete("/:id", protect, checkRole("author", "admin"), deleteBook);
module.exports = router;
