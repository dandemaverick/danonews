import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/api/news", async (req, res) => {

  try {

    const category =
      req.query.category || "general";

    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?country=gh&category=${category}&apikey=${process.env.GNEWS_API_KEY}`
    );

    const data = await response.json();

    res.json(data);

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch news",
    });

  }

});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});