import { API_BASE } from "../config";

const API_URL = import.meta.env.VITE_API_URL || API_BASE;

export async function getNews(category = "general") {
  try {
    const query = new URLSearchParams({ category });
    const response = await fetch(`${API_URL.replace(/\/+$/, "")}/api/news?${query}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const articles = Array.isArray(data) ? data : data?.articles;
    if (!Array.isArray(articles)) {
      throw new Error("Invalid news feed");
    }

    return articles.filter((article) => typeof article?.title === "string" && article.title.trim());
  } catch (error) {
    console.warn("Could not refresh the news feed:", error.message);
    return [];
  }
}
