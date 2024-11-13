// controllers/bookController.js
const Book = require("../models/book");
const User = require("../models/user");

exports.createBook = async (req, res) => {
  try {
    const { title, description, images } = req.body; 
    const author = req.user._id;

    if (!images) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const newBook = new Book({
      title,
      description,
      author,
      images, 
    });

    // Save the new book
    await newBook.save();

    // Update the User's book list (if needed)
    await User.findByIdAndUpdate(
      author,
      { $push: { books: newBook._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book: newBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getAllBooks = async (req, res) => {
  try {
    const {
      author,
      title,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.query;

    // Set up the query filters
    let filters = {};

    if (author) {
      // Find author by name
      const authorDoc = await User.findOne({ name: author });
      if (authorDoc) {
        filters.author = authorDoc._id;
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Author not found" });
      }
    }

    if (title) {
      filters.title = { $regex: title, $options: "i" };
    }

    let sort = {};
    if (sortBy && sortOrder) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Get pagination values
    const skip = (page - 1) * limit;

    // Query the books with filters, sorting, and pagination
    const books = await Book.find(filters)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort)
      .populate("author", "name");

    // Get total books count for pagination info
    const totalBooks = await Book.countDocuments(filters);
    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({
      success: true,
      page,
      totalPages,
      totalBooks,
      books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id)
      .populate("author")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          model: "User",
          select: "name email",
        },
      });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.editBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, images } = req.body;

    const book = await Book.findByIdAndUpdate(
      id,
      { title, description, images },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the book
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is required",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const review = {
      user: req.user._id,
      comment,
      rating,
    };

    book.reviews.push(review);

    const totalRatings = book.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    book.ratings = (totalRatings / book.reviews.length).toFixed(1);

    await book.save();

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await User.findById(req.params.id)
      .select("-password")
      .populate("books")
      .populate({
        path: "books",
        select: "title author reviews ratings images",
        populate: {
          path: "reviews.user",
          select: "name",
        },
      });

    if (!author) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    res.status(200).json({
      success: true,
      data: author,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, error: error.message });
  }
};
