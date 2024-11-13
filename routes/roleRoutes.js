const express = require("express");
const { checkRole } = require("../middlewares/roleMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route accessible only by authors
router.get("/author-only-route", protect, checkRole(["author"]), (req, res) => {
  res.json({ success: true, message: "This is an author-only route" });
});

// Route accessible by both users and authors
router.get("/user-or-author-route", protect, checkRole(["user", "author"]), (req, res) => {
  res.json({ success: true, message: "This route is accessible by users and authors" });
});

module.exports = router;
