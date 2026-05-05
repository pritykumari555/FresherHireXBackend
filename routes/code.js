const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/run", async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: getLanguageId(language),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY, // ✅ from .env
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    res.json({
      output:
        response.data.stdout ||
        response.data.stderr ||
        response.data.compile_output ||
        response.data.message ||
        "No output",
    });

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Execution failed" });
  }
});

function getLanguageId(lang) {
  if (lang === "javascript") return 63;
  if (lang === "python") return 71;
  if (lang === "cpp") return 54;
  return 63; // default
}

module.exports = router;