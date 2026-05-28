console.log("🚀 THIS SERVER FILE IS RUNNING");

/* =========================
   LOAD ENV FIRST
========================= */
import dotenv from "dotenv";
dotenv.config();

/* =========================
   IMPORTS
========================= */
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import OpenAI from "openai";

/* =========================
   INIT APP
========================= */
const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   ENV
========================= */
const PORT = process.env.PORT || 5000;

const GNEWS_API_KEY =
  process.env.GNEWS_API_KEY;

const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY;

if (!GNEWS_API_KEY) {

  console.error(
    "❌ GNEWS_API_KEY missing"
  );

  process.exit(1);
}

console.log(
  "✅ GNews API Loaded"
);

if (!OPENAI_API_KEY) {

  console.warn(
    "⚠️ OpenAI not configured (AI disabled)"
  );
}

/* =========================
   OPENAI SETUP
========================= */
const openai = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
  : null;

/* =========================
   CATEGORY MAP
========================= */
const CATEGORY_MAP = {
  general: "general",
  world: "world",
  nation: "nation",
  business: "business",
  technology: "technology",
  entertainment: "entertainment",
  sports: "sports",
  science: "science",
  health: "health",
};

/* =========================
   CACHE
========================= */
const cache = {};

const CACHE_TIME =
  60 * 1000;

const getCache = (key) => {

  if (!cache[key]) {
    return null;
  }

  if (
    Date.now() -
      cache[key].time >
    CACHE_TIME
  ) {

    delete cache[key];

    return null;
  }

  return cache[key].data;
};

const setCache = (
  key,
  data
) => {

  cache[key] = {
    data,
    time: Date.now(),
  };
};

/* =========================
   NORMALIZE DATA
========================= */
const normalize = (
  articles = []
) => {

  return articles
    .filter(
      (a) =>
        a &&
        a.title &&
        a.url
    )
    .map((a) => ({
      id: Buffer.from(
        a.url
      ).toString("base64"),

      title: a.title,

      description:
        a.description || "",

      image:
        a.image ||
        "https://via.placeholder.com/600x400?text=DanoNews",

      url: a.url,

      source:
        a.source?.name ||
        "Unknown",

      publishedAt:
        a.publishedAt,

      content:
        a.content || "",
    }));
};

/* =========================
   FETCH HELPER
========================= */
const fetchNews =
  async (url) => {

    console.log(
      "🌍 API CALL:",
      url
    );

    const response =
      await fetch(url);

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.articles
    ) {

      throw new Error(
        data.message ||
          "GNews failed"
      );
    }

    return {
      total:
        data.totalArticles || 0,

      articles: normalize(
        data.articles
      ),
    };
  };

/* =========================
   HEALTH
========================= */
app.get("/", (req, res) => {

  res.send(
    "🚀 DanoNews API running"
  );
});

/* =========================
   NEWS
========================= */
app.get(
  "/api/news",
  async (req, res) => {

    try {

      const category =
        CATEGORY_MAP[
          req.query.category?.toLowerCase()
        ] || "general";

      const page =
        Number(
          req.query.page
        ) || 1;

      const limit =
        Number(
          req.query.limit
        ) || 12;

      const cacheKey =
        `news-${category}-${page}-${limit}`;

      const cached =
        getCache(cacheKey);

      if (cached) {

        console.log(
          "⚡ CACHE HIT:",
          category
        );

        return res.json(
          cached
        );
      }

      const url =
      https://gnews.io/api/v4/top-headlines?country=gh&lang=en&max=20&category=${category}&apikey=${process.env.GNEWS_API_KEY}

      const result =
        await fetchNews(url);

      setCache(
        cacheKey,
        result
      );

      res.json(result);

    } catch (error) {

      console.error(
        "❌ News error:",
        error.message
      );

      res
        .status(500)
        .json({
          error:
            error.message,
        });
    }
  }
);

/* =========================
   SEARCH
========================= */
app.get(
  "/api/search",
  async (req, res) => {

    try {

      const q =
        req.query.q?.trim();

      if (!q) {

        return res
          .status(400)
          .json({
            error:
              "Query required",
          });
      }

      const cacheKey =
        `search-${q}`;

      const cached =
        getCache(cacheKey);

      if (cached) {

        return res.json(
          cached
        );
      }

      const url =
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=12&apikey=${GNEWS_API_KEY}`;

      const result =
        await fetchNews(url);

      setCache(
        cacheKey,
        result
      );

      res.json(result);

    } catch (error) {

      console.error(
        "❌ Search error:",
        error.message
      );

      res
        .status(500)
        .json({
          error:
            error.message,
        });
    }
  }
);

/* =========================
   GHANA NEWS
========================= */
app.get(
  "/api/ghana",
  async (req, res) => {

    try {

      const cacheKey =
        "ghana-news";

      const cached =
        getCache(cacheKey);

      if (cached) {

        return res.json(
          cached
        );
      }

      const url =
        `https://gnews.io/api/v4/search?q=ghana&lang=en&max=12&apikey=${GNEWS_API_KEY}`;

      const result =
        await fetchNews(url);

      setCache(
        cacheKey,
        result
      );

      res.json(result);

    } catch (error) {

      console.error(
        "❌ Ghana error:",
        error.message
      );

      res
        .status(500)
        .json({
          error:
            error.message,
        });
    }
  }
);

/* =========================
   AI SUMMARY
========================= */
app.post(
  "/api/summarize",
  async (req, res) => {

    try {

      if (!openai) {

        return res
          .status(500)
          .json({
            error:
              "AI not configured",
          });
      }

      const {
        title,
        content,
      } = req.body;

      if (
        !content ||
        content.length < 50
      ) {

        return res
          .status(400)
          .json({
            error:
              "Content too short for summary",
          });
      }

      console.log(
        "🤖 Generating AI summary..."
      );

      const completion =
        await openai.chat.completions.create({
          model:
            "gpt-4.1-mini",

          messages: [
            {
              role: "user",

              content:
                `Summarize this article in 3 short bullet points:\n\nTitle: ${title}\n\n${content}`,
            },
          ],
        });

      const summary =
        completion
          .choices[0]
          .message.content;

      res.json({
        summary,
      });

    } catch (error) {

      console.error(
        "❌ AI error:",
        error.message
      );

      res
        .status(500)
        .json({
          error:
            "AI summary failed",
        });
    }
  }
);

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {

  console.log(
    `🔥 Server running on http://localhost:${PORT}`
  );
});