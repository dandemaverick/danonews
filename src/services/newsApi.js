const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   GET NEWS (Robust Version)
========================= */

export async function getNews(category = "general") {
  try {
    console.log(`Fetching ${category} news...`);

    const response = await fetch(
      `${API_URL}/api/news?category=${category}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // Add timeout
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ NEWS FETCHED:", data);

    return data.articles || data || [];
  } catch (error) {
    console.warn("⚠️ Backend fetch failed, using demo data:", error.message);
    
    // Fallback demo data
    return [
      {
        title: "Mahama Unveils Bold 24-Hour Economy Policy",
        description: "President John Dramani Mahama introduces comprehensive plan to transform Ghana’s economy.",
        image: "https://picsum.photos/id/1015/1200/630",
        category: "Politics"
      },
      {
        title: "Black Stars Squad Announced for World Cup Qualifiers",
        description: "Otto Addo names strong squad as preparation intensifies.",
        image: "https://picsum.photos/id/870/600/400",
        category: "Sports"
      },
      {
        title: "Cedi Gains 2.3% Against US Dollar",
        description: "Ghana's currency records strong performance.",
        image: "https://picsum.photos/id/106/600/400",
        category: "Business"
      },
      {
        title: "Fuel Prices Expected to Drop by 8% Next Month",
        description: "Motorists to benefit from falling global oil prices.",
        image: "https://picsum.photos/id/201/600/400",
        category: "Business"
      }
    ];
  }
}