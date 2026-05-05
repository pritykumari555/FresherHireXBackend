const express = require("express");
const router = express.Router();

router.post("/analyze", (req, res) => {
  res.json({
    score: 8,
    strengths: ["Working"],
    weaknesses: ["None"],
    suggestions: ["Good job"],
  });
});

module.exports = router;