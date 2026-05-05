
require("dotenv").config(); // ⭐ MUST BE FIRST LINE



const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // ⭐ IMPORTANT

const app = express();

// Models
const usermodel = require("./models/user");
const Application = require("./models/apply");
const Question = require("./models/question");

// Routes
const aiRoutes = require("./routes/ai");
const codeRoutes = require("./routes/code");

// Middleware
app.use(cors({
  origin: "https://fresher-hire-x.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB CONNECTION (FIXED)
// Prevent duplicate connection on hot reload
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => console.log("MongoDB error ❌", err));
}

// Routes
app.use("/ai", aiRoutes);
app.use("/code", codeRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const ExistUser = await usermodel.findOne({ email });

    if (!ExistUser) {
      return res.status(404).json({ message: "No account found ❌" });
    }

    if (ExistUser.password !== password) {
      return res.status(401).json({ message: "Wrong password ❌" });
    }

    return res.status(200).json({ message: "Login successful ✅" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await usermodel.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Account already exists!" });
    }

    const newUser = await usermodel.create({ name, email, password });

    return res.status(201).json({
      message: "Signup successful ✅",
      user: newUser,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// APPLY (FIXED - SAVE TO DB)
app.post("/apply", async (req, res) => {
  try {
    const { name, email, skill, projectLink, github } = req.body;

    const newApp = await Application.create({
      name,
      email,
      skill,
      projectLink,
      github,
    });

    res.json({
      message: "Application submitted ✅",
      data: newApp,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// QUESTION ADD
app.post("/question", async (req, res) => {
  try {
    const { company, question, options, answer } = req.body;

    const newQ = await Question.create({
      company: company.toLowerCase(),
      question,
      options,
      answer,
    });

    res.json({
      message: "Question added ✅",
      data: newQ,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET QUESTIONS
app.get("/question/:company", async (req, res) => {
  try {
    const company = req.params.company.toLowerCase();

    const questions = await Question.find({ company });

    res.json(questions);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PORT (FIXED)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});