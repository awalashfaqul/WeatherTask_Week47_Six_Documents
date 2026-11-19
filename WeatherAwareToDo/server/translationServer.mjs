
import express from "express";
import "dotenv/config";

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json({ limit: "10kb" }));

// Translation API configuration
const TRANSLATE_API_URL =
  process.env.TRANSLATE_API_URL ||
  "https://libretranslate.com/translate";

const TRANSLATE_API_KEY =
  process.env.TRANSLATE_API_KEY || "";

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Translation server is running"
  });
});

// Translation endpoint
app.post("/api/translate", async (req, res) => {
  const { text, target } = req.body ?? {};

  // Validate request
  if (
    typeof text !== "string" ||
    text.trim().length === 0 ||
    text.length > 1000 ||
    !["en", "sv"].includes(target)
  ) {
    return res.status(400).json({
      error: "Invalid translation request",
      message:
        "Provide text (1–1000 characters) and target 'en' or 'sv'."
    });
  }

  try {
    const requestBody = {
      q: text.trim(),
      source: "auto",
      target,
      ...(TRANSLATE_API_KEY
        ? { api_key: TRANSLATE_API_KEY }
        : {})
    };

    const response = await fetch(TRANSLATE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
  const errorBody = await response.text();

  console.error(
    `Translation provider returned HTTP ${response.status}`,
    errorBody
  );

  return res.status(502).json({
    error: "Translation provider error",
    message: `Provider returned HTTP ${response.status}`
  });
}

    const data = await response.json();

    if (typeof data.translatedText !== "string") {
      throw new Error(
        "Invalid response from translation provider"
      );
    }

    return res.json({
      originalText: text,
      translatedText: data.translatedText,
      targetLanguage: target
    });
  } catch (error) {
    console.error("Translation error:", error);

    return res.status(502).json({
      error: "Translation service unavailable",
      message:
        "Check the translation API URL, API key, and network connection."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("-----------------------------------");
  console.log("WeatherTask Translation Server");
  console.log(`Running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log("-----------------------------------");
});
