require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const questionRoute = require("./routes/questionRoute");
const solutionRoute = require("./routes/solutionRoute");
const testcaseRoute = require("./routes/testcaseRoute");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoute);
app.use("/api/testcase", testcaseRoute);
app.use("/api/solutions", solutionRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
