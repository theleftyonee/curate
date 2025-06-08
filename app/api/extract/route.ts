import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"

export const runtime = 'nodejs';

interface CategoryRule {
  category: string
  subcategory: string
  keywords: string[]
  domains?: string[]
  urlPatterns?: RegExp[]
}

const CATEGORY_RULES: CategoryRule[] = [
  // Entertainment
  {
    category: "Entertainment",
    subcategory: "Movies",
    keywords: ["movie", "film", "cinema", "imdb", "trailer", "actor", "actress"],
    domains: ["imdb.com", "rottentomatoes.com", "moviefone.com"],
  },
  {
    category: "Entertainment",
    subcategory: "TV Shows",
    keywords: ["tv", "television", "series", "episode", "season", "netflix", "hulu"],
    domains: ["netflix.com", "hulu.com", "hbo.com"],
  },
  {
    category: "Entertainment",
    subcategory: "Music",
    keywords: ["music", "song", "album", "artist", "spotify", "apple music"],
    domains: ["spotify.com", "music.apple.com", "soundcloud.com"],
  },
  {
    category: "Entertainment",
    subcategory: "Books",
    keywords: ["book", "novel", "author", "reading", "literature", "kindle"],
    domains: ["amazon.com/books", "goodreads.com", "audible.com"],
  },
  {
    category: "Entertainment",
    subcategory: "Video Games",
    keywords: ["game", "gaming", "xbox", "playstation", "nintendo", "steam"],
    domains: ["steam.com", "xbox.com", "playstation.com"],
  },

  // Travel and Places
  {
    category: "Travel and Places",
    subcategory: "Destinations",
    keywords: ["travel", "destination", "vacation", "trip", "tourism", "visit"],
  },
  {
    category: "Travel and Places",
    subcategory: "Hotels and Accommodations",
    keywords: ["hotel", "accommodation", "booking", "airbnb", "resort"],
    domains: ["booking.com", "airbnb.com", "hotels.com"],
  },
  {
    category: "Travel and Places",
    subcategory: "Restaurants",
    keywords: ["restaurant", "dining", "food", "menu", "yelp"],
    domains: ["yelp.com", "opentable.com", "zomato.com"],
  },
  {
    category: "Travel and Places",
    subcategory: "Attractions",
    keywords: ["attraction", "museum", "park", "landmark", "sightseeing"],
  },
  {
    category: "Travel and Places",
    subcategory: "Travel Tips",
    keywords: ["travel tips", "guide", "itinerary", "packing", "budget travel"],
  },

  // Food and Dining
  {
    category: "Food and Dining",
    subcategory: "Recipes",
    keywords: ["recipe", "cooking", "ingredients", "cook", "bake", "kitchen"],
    domains: ["allrecipes.com", "food.com", "epicurious.com"],
  },
  {
    category: "Food and Dining",
    subcategory: "Food Reviews",
    keywords: ["food review", "restaurant review", "taste", "flavor"],
  },
  {
    category: "Food and Dining",
    subcategory: "Cooking Tips",
    keywords: ["cooking tips", "chef", "culinary", "technique"],
  },
  {
    category: "Food and Dining",
    subcategory: "Dietary Information",
    keywords: ["diet", "nutrition", "healthy", "vegan", "vegetarian", "keto"],
  },

  // Shopping and Products
  {
    category: "Shopping and Products",
    subcategory: "Electronics",
    keywords: ["electronics", "gadget", "phone", "laptop", "computer", "tech"],
    domains: ["amazon.com", "bestbuy.com", "newegg.com"],
  },
  {
    category: "Shopping and Products",
    subcategory: "Fashion",
    keywords: ["fashion", "clothing", "style", "outfit", "brand"],
    domains: ["zara.com", "h&m.com", "nike.com"],
  },
  {
    category: "Shopping and Products",
    subcategory: "Home and Garden",
    keywords: ["home", "garden", "furniture", "decor", "diy"],
  },
  {
    category: "Shopping and Products",
    subcategory: "Beauty Products",
    keywords: ["beauty", "makeup", "skincare", "cosmetics"],
    domains: ["sephora.com", "ulta.com"],
  },
  {
    category: "Shopping and Products",
    subcategory: "Sports Equipment",
    keywords: ["sports", "equipment", "fitness", "athletic", "gear"],
  },

  // Education and Learning
  {
    category: "Education and Learning",
    subcategory: "Online Courses",
    keywords: ["course", "learning", "education", "tutorial", "udemy", "coursera"],
    domains: ["udemy.com", "coursera.org", "edx.org"],
  },
  {
    category: "Education and Learning",
    subcategory: "Tutorials",
    keywords: ["tutorial", "how to", "guide", "learn", "step by step"],
  },
  {
    category: "Education and Learning",
    subcategory: "Articles",
    keywords: ["article", "blog", "post", "read", "information"],
  },
  {
    category: "Education and Learning",
    subcategory: "Research Papers",
    keywords: ["research", "paper", "study", "academic", "journal"],
  },

  // Social Media
  {
    category: "Social Media",
    subcategory: "Posts",
    keywords: ["post", "social", "share", "update"],
    domains: ["facebook.com", "twitter.com", "instagram.com", "linkedin.com"],
  },
  { category: "Social Media", subcategory: "Profiles", keywords: ["profile", "account", "user", "bio"] },
  { category: "Social Media", subcategory: "Events", keywords: ["event", "meetup", "gathering", "conference"] },

  // News and Media
  {
    category: "News and Media",
    subcategory: "Articles",
    keywords: ["news", "article", "breaking", "report", "journalism"],
    domains: ["cnn.com", "bbc.com", "reuters.com", "nytimes.com"],
  },
  {
    category: "News and Media",
    subcategory: "Videos",
    keywords: ["video", "watch", "youtube", "documentary"],
    domains: ["youtube.com", "vimeo.com"],
  },
  {
    category: "News and Media",
    subcategory: "Podcasts",
    keywords: ["podcast", "audio", "listen", "episode"],
    domains: ["spotify.com/podcasts", "apple.com/podcasts"],
  },
  { category: "News and Media", subcategory: "Blogs", keywords: ["blog", "blogger", "personal", "opinion"] },

  // Health and Fitness
  {
    category: "Health and Fitness",
    subcategory: "Workouts",
    keywords: ["workout", "exercise", "fitness", "gym", "training"],
  },
  {
    category: "Health and Fitness",
    subcategory: "Nutrition",
    keywords: ["nutrition", "diet", "healthy eating", "vitamins", "supplements"],
  },
  {
    category: "Health and Fitness",
    subcategory: "Health Articles",
    keywords: ["health", "medical", "wellness", "doctor", "medicine"],
  },
  {
    category: "Health and Fitness",
    subcategory: "Wellness Tips",
    keywords: ["wellness", "mental health", "self care", "meditation"],
  },

  // Real Estate
  {
    category: "Real Estate",
    subcategory: "Property Listings",
    keywords: ["property", "house", "apartment", "real estate", "for sale", "for rent"],
    domains: ["zillow.com", "realtor.com", "redfin.com"],
  },
  { category: "Real Estate", subcategory: "Market Trends", keywords: ["market", "trends", "prices", "housing market"] },
  {
    category: "Real Estate",
    subcategory: "Home Buying Tips",
    keywords: ["home buying", "mortgage", "loan", "first time buyer"],
  },

  // Technology and Gadgets
  {
    category: "Edge Use Cases",
    subcategory: "Technology and Gadgets",
    keywords: ["technology", "tech", "gadget", "innovation", "software", "hardware"],
  },
  {
    category: "Edge Use Cases",
    subcategory: "Legal and Financial",
    keywords: ["legal", "law", "financial", "money", "investment", "tax"],
  },
  {
    category: "Edge Use Cases",
    subcategory: "Personal Development",
    keywords: ["personal development", "self improvement", "productivity", "motivation"],
  },
]

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ""
  }
}

function categorizeContent(
  title: string,
  description: string,
  url: string,
  keywords: string[],
): { category: string; subcategory: string } {
  const content = `${title} ${description} ${url} ${keywords.join(" ")}`.toLowerCase()
  const domain = extractDomain(url)

  // Check domain-based rules first
  for (const rule of CATEGORY_RULES) {
    if (rule.domains && rule.domains.some((d) => domain.includes(d))) {
      return { category: rule.category, subcategory: rule.subcategory }
    }
  }

  // Check keyword-based rules
  let bestMatch = { category: "Edge Use Cases", subcategory: "Niche Communities", score: 0 }

  for (const rule of CATEGORY_RULES) {
    let score = 0
    for (const keyword of rule.keywords) {
      if (content.includes(keyword.toLowerCase())) {
        score += 1
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { category: rule.category, subcategory: rule.subcategory, score }
    }
  }

  return { category: bestMatch.category, subcategory: bestMatch.subcategory }
}

async function generateSummary(title: string, content: string): Promise<string> {
  // Prepare prompt
  const prompt = `You are an expert summarization AI focused on absolute brevity. Produce a concise bullet-list summary with at most 5 punchy, standalone points. Prioritize root causes, key consequences, systemic failures, vital statistics, and essential arguments. No fluff or background. Keep the entire summary under 60 words.
Title: ${title}

Content: ${content.substring(0, 3000)}`;

  // Determine API key, fallback for local testing
  const apiKey = process.env.MISTRAL_API_KEY || '8xtg84Nq4ytFo7msiytmjDvDMXcnHiq9';
  console.log('Mistral API key used:', apiKey.startsWith('8xtg8') ? '[fallback]' : '[env]');

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'mistral-small-latest', messages: [{ role: 'user', content: prompt }], max_tokens: 100 }),
    });
    if (!response.ok) throw new Error(`API error ${response.status}`);
    const data = await response.json();
    return (data.choices?.[0]?.message?.content || '').trim();
  } catch (err) {
    console.error('Mistral fetch error:', err);
    return 'Summary generation failed. Please try again later.';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Fetch the webpage
    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 400 },
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract metadata
    const title =
      $("title").text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      "No title found"

    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      ""

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('link[rel="icon"]').attr("href") ||
      ""

    // Extract keywords from meta tags and content
    const metaKeywords = $('meta[name="keywords"]').attr("content") || ""
    const headings = $("h1, h2, h3")
      .map((_, el) => $(el).text())
      .get()
    const keywords = [
      ...metaKeywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k),
      ...headings.slice(0, 5),
    ].filter((k) => k.length > 2 && k.length < 50)

    // Extract body content (first 1000 characters)
    const bodyContent = $("body").text().replace(/\s+/g, " ").trim().substring(0, 1000)

    // Categorize the content
    const { category, subcategory } = categorizeContent(title, description, url, keywords)

    // Generate summary
    const summary = await generateSummary(title, bodyContent)

    const result = {
      title,
      description,
      image: image ? (image.startsWith("http") ? image : new URL(image, validUrl.origin).toString()) : undefined,
      keywords: keywords.slice(0, 10), // Limit to 10 keywords
      category,
      subcategory,
      url: validUrl.toString(),
      extractedAt: new Date().toISOString(),
      bodyContent,
      summary,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing URL:", error)
    return NextResponse.json({ error: "Failed to process URL. Please check the URL and try again." }, { status: 500 })
  }
}
