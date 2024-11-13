const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Import Routes
const userRoutes = require("./routes/userRoutes");
const genreRoutes = require("./routes/genreRoutes")
const roleRoutes = require("./routes/roleRoutes")
const bookRoutes = require("./routes/bookRoutes")

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")))
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/book", bookRoutes);

const URI = process.env.MONGODB_URL;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
  .then(() => {
    console.log("Database Connected");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
