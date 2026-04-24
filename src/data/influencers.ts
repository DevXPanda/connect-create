export type Influencer = {
  id: string;
  name: string;
  handle: string;
  category: string;
  followers: number;
  startingPrice: number;
  location: string;
  rating: number;
  reviews: number;
  available: boolean;
  avatar: string;
  cover: string;
  bio: string;
};

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&q=80",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
];

const covers = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80",
  "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=900&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
  "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=900&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
];

const data: Omit<Influencer, "avatar" | "cover">[] = [
  { id: "1", name: "Aria Sundström", handle: "@ariasun", category: "Fashion", followers: 482000, startingPrice: 320, location: "Stockholm, SE", rating: 4.9, reviews: 124, available: true, bio: "Minimalist fashion editor blending Scandi style with global streetwear." },
  { id: "2", name: "Marco Vidal", handle: "@marcovidal", category: "Fitness", followers: 1240000, startingPrice: 850, location: "Miami, US", rating: 4.8, reviews: 312, available: true, bio: "Coach and movement specialist. Mobility, hybrid training, real talk." },
  { id: "3", name: "Yuki Tanaka", handle: "@yukibyte", category: "Tech", followers: 685000, startingPrice: 540, location: "Tokyo, JP", rating: 5.0, reviews: 87, available: false, bio: "Reviewing the future, one gadget at a time." },
  { id: "4", name: "Zara Okonkwo", handle: "@zaraok", category: "Beauty", followers: 920000, startingPrice: 700, location: "Lagos, NG", rating: 4.9, reviews: 203, available: true, bio: "Skin-first beauty creator. Honest reviews and bold tutorials." },
  { id: "5", name: "Leo Marchetti", handle: "@leoplays", category: "Gaming", followers: 2100000, startingPrice: 1200, location: "Milan, IT", rating: 4.7, reviews: 451, available: true, bio: "Streamer, esports caster, indie game champion." },
  { id: "6", name: "Sofia Reyes", handle: "@sofireyes", category: "Travel", followers: 358000, startingPrice: 280, location: "Lisbon, PT", rating: 4.9, reviews: 98, available: true, bio: "Slow travel storytelling across hidden corners of Europe." },
  { id: "7", name: "Noah Bennett", handle: "@noahcooks", category: "Food", followers: 712000, startingPrice: 460, location: "Brooklyn, US", rating: 4.8, reviews: 176, available: true, bio: "Modern home cooking. 30-minute recipes with serious flavor." },
  { id: "8", name: "Priya Anand", handle: "@priyalifts", category: "Fitness", followers: 540000, startingPrice: 420, location: "Bangalore, IN", rating: 4.9, reviews: 142, available: false, bio: "Strength coach helping women break their personal records." },
  { id: "9", name: "Diego Ferrer", handle: "@diegolens", category: "Photography", followers: 290000, startingPrice: 350, location: "Barcelona, ES", rating: 5.0, reviews: 64, available: true, bio: "Street and editorial photographer. Light is everything." },
  { id: "10", name: "Hana Park", handle: "@hanaglow", category: "Beauty", followers: 1080000, startingPrice: 780, location: "Seoul, KR", rating: 4.9, reviews: 268, available: true, bio: "K-beauty rituals, science-backed routines." },
  { id: "11", name: "Eli Carter", handle: "@elicodes", category: "Tech", followers: 410000, startingPrice: 380, location: "Berlin, DE", rating: 4.8, reviews: 91, available: true, bio: "Developer advocate. AI tools, productivity, dev culture." },
  { id: "12", name: "Maya Lindgren", handle: "@mayawanders", category: "Travel", followers: 625000, startingPrice: 500, location: "Reykjavík, IS", rating: 4.9, reviews: 188, available: true, bio: "Cold landscapes, warm stories. Sustainable travel advocate." },
];

export const influencers: Influencer[] = data.map((d, i) => ({
  ...d,
  avatar: avatars[i % avatars.length],
  cover: covers[i % covers.length],
}));

export const categories = [
  { name: "Fashion", emoji: "👗", count: 1240 },
  { name: "Fitness", emoji: "💪", count: 980 },
  { name: "Tech", emoji: "💻", count: 760 },
  { name: "Beauty", emoji: "💄", count: 1430 },
  { name: "Gaming", emoji: "🎮", count: 890 },
  { name: "Travel", emoji: "✈️", count: 670 },
  { name: "Food", emoji: "🍜", count: 580 },
  { name: "Photography", emoji: "📸", count: 430 },
];

export function formatFollowers(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return String(n);
}
