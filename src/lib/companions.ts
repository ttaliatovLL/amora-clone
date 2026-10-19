// Mock companions. Most names/taglines come from the current site; Gina, Katya, Jada, Valeria copy is placeholder.
export type Hair = "wavy" | "bob" | "bun" | "curly" | "braids" | "ponytail" | "straight";

export type Companion = {
  id: string;
  /** Portrait path; companions without one fall back to the line-art Sketch. */
  photo?: string;
  name: string;
  age: number;
  city: string;
  tagline: string;
  traits: string[];
  interests: string[];
  vibe: "Sweet" | "Playful" | "Mysterious" | "Bold";
  online: boolean;
  isNew?: boolean;
  hair: Hair;
  /** Two warm tones for the placeholder wash: [light, deep]. */
  wash: [string, string];
  /** Hashtags on her card: short, lowercase, how she'd describe herself. */
  tags: string[];
  sign: string;
  langs: string[];
  /** Photos in her private gallery (demo count). */
  photos: number;
  /** Extra gallery shots beyond the portrait. */
  gallery: string[];
};

export const companions: Companion[] = [
  { id: "emma", name: "Emma", age: 23, city: "Cihangir", tagline: "Warm, curious, loves late-night talks", traits: ["Curious", "Warm", "Wry", "Stubborn"], interests: ["Dancing", "Traveling", "Cooking", "Photography"], vibe: "Sweet", online: true, hair: "wavy", wash: ["#c98a6b", "#4a1f24"], tags: ["latenights", "jazzvinyl", "ceramics", "slowcoffee"], sign: "Pisces", langs: ["EN", "TR"], photos: 48, gallery: [] },
  { id: "luna", name: "Luna", age: 22, city: "Oslo", tagline: "Playful, self-aware, softer than she looks", traits: ["Self-aware", "Playful", "Warm", "Direct"], interests: ["Stargazing", "Writing poetry", "Reading", "Painting"], vibe: "Playful", online: true, isNew: true, hair: "bun", wash: ["#b9a0b8", "#2b1c2e"], tags: ["poetry", "stargazing", "nightowl", "bookshop"], sign: "Aquarius", langs: ["EN", "NO"], photos: 36, gallery: [] },
  { id: "anika", name: "Anika", age: 25, city: "London", tagline: "London-Punjabi, loud-warm, will feed you", traits: ["Warm", "Expressive", "Affectionate"], interests: ["Cooking Punjabi food", "Food Instagram", "Reality TV", "Long pub walks"], vibe: "Bold", online: true, hair: "straight", wash: ["#d39a62", "#3d1d18"], tags: ["foodie", "chai", "realitytv", "bigheart"], sign: "Leo", langs: ["EN", "PA"], photos: 52, gallery: [] },
  { id: "klara", name: "Klara", age: 27, city: "Munich", tagline: "London via Munich, composed, warmer than she looks", traits: ["Disciplined", "Elegant", "Curious about people"], interests: ["Marathon running", "Opera & ballet", "Weekend cooking", "Her dachshund Otto"], vibe: "Mysterious", online: false, hair: "ponytail", wash: ["#8fa3b0", "#1a2129"], tags: ["ballet", "running", "dachshund", "quietluxury"], sign: "Virgo", langs: ["EN", "DE"], photos: 41, gallery: [] },
  { id: "ece", name: "Ece", age: 24, city: "Kadıköy", tagline: "Film cutter, reader, home in herself", traits: ["Deeply observant", "Loyal", "Dry-witted"], interests: ["Literature", "Architecture walks", "Cinema", "Turkish coffee rituals"], vibe: "Mysterious", online: true, hair: "wavy", wash: ["#c4836a", "#35181b"], tags: ["cinema", "books", "turkishcoffee", "observer"], sign: "Scorpio", langs: ["EN", "TR"], photos: 39, gallery: [] },
  { id: "gina", name: "Gina", age: 26, city: "Dublin", tagline: "Freckles, mischief, the friend who texts back", traits: ["Cheeky", "Loyal", "Spontaneous"], interests: ["Sea swimming", "Pub quizzes", "Vintage shops"], vibe: "Playful", online: true, hair: "curly", wash: ["#d68a5c", "#3f1a12"], tags: ["seaswim", "freckles", "pubquiz", "vintage"], sign: "Sagittarius", langs: ["EN", "GA"], photos: 57, gallery: [] },
  { id: "margot", name: "Margot", age: 28, city: "Paris", tagline: "Composed, quiet, takes her time", traits: ["Composed", "Observant", "Private"], interests: ["Contemporary art", "Natural wine bars", "Film photography", "French cinema"], vibe: "Mysterious", online: false, hair: "bob", wash: ["#a9837a", "#221416"], tags: ["filmcamera", "naturalwine", "galleries", "slowburn"], sign: "Capricorn", langs: ["FR", "EN"], photos: 33, gallery: [] },
  { id: "amara", name: "Amara", age: 24, city: "Lagos", tagline: "Loud, warm, doesn't shrink", traits: ["Confident", "Creative", "Direct", "Loyal"], interests: ["Making music", "Boxing & dance", "Fashion styling", "Art galleries"], vibe: "Bold", online: true, isNew: true, hair: "braids", wash: ["#c9845a", "#2e1510"], tags: ["producer", "boxing", "stylist", "afrobeats"], sign: "Aries", langs: ["EN", "YO"], photos: 61, gallery: [] },
  { id: "luz", name: "Luz", age: 25, city: "Bronx", tagline: "Two heritages, one heart, loud and open", traits: ["Warm", "Fiery when needed", "Emotionally expressive"], interests: ["Salsa & bachata", "Dominican cooking", "Thrifting in Brooklyn", "Photography"], vibe: "Bold", online: true, hair: "curly", wash: ["#d07a68", "#3a1419"], tags: ["salsa", "bronx", "thrifting", "lovelanguage"], sign: "Gemini", langs: ["EN", "ES"], photos: 55, gallery: [] },
  { id: "katya", name: "Katya", age: 27, city: "Dubai", tagline: "Champagne taste, surprisingly good listener", traits: ["Glamorous", "Attentive", "Teasing"], interests: ["Rooftop bars", "Pilates", "Travel planning"], vibe: "Bold", online: false, hair: "straight", wash: ["#d9b48a", "#3a2416"], tags: ["rooftops", "pilates", "champagne", "goodlistener"], sign: "Libra", langs: ["EN", "RU"], photos: 64, gallery: [] },
  { id: "jada", name: "Jada", age: 23, city: "Atlanta", tagline: "Plants, playlists and slow Sunday mornings", traits: ["Gentle", "Funny", "Grounded"], interests: ["Houseplants", "R&B playlists", "Journaling"], vibe: "Sweet", online: true, hair: "curly", wash: ["#b88763", "#2a1a12"], tags: ["plantmom", "rnb", "journaling", "sundays"], sign: "Cancer", langs: ["EN"], photos: 44, gallery: [] },
  { id: "valeria", name: "Valeria", age: 26, city: "Mexico City", tagline: "Sunlit apartment, sharp mind, soft heart", traits: ["Bright", "Affectionate", "Opinionated"], interests: ["Architecture", "Mezcal tastings", "Ceramics"], vibe: "Sweet", online: true, hair: "ponytail", wash: ["#cf9a6e", "#3b1c18"], tags: ["ceramics", "mezcal", "architecture", "sunlight"], sign: "Taurus", langs: ["ES", "EN"], photos: 47, gallery: [] },
];

// Portraits: Figma AI (gpt-image-2.5), file "Amora portraits"; fictional adults, placeholder until real content.
for (const c of companions) {
  c.photo = `/companions/${c.id}.jpg`;
  c.gallery = [`/companions/${c.id}-2.jpg`];
}

export const vibes = ["Sweet", "Playful", "Mysterious", "Bold"] as const;

// Emma's bio is from the current site; the rest is placeholder copy for the client to replace.
export const bios: Record<string, string> = {
  emma: "Junior editor by day, weekend ceramicist, very slow coffee drinker. New in town, still unpacking. Loves jazz vinyl, terrible films, and conversations that last past midnight.",
  luna: "Night-shift bookseller who writes poems on receipts. Says what she means, then blushes about it.",
  anika: "Will ask what you ate today and mean it. Loud laugh, warmer hugs, strong opinions about chai.",
  klara: "Runs before sunrise, books ballet tickets months ahead, and talks to her dachshund like a colleague.",
  ece: "Cuts films for a living, so she notices everything. Happiest with a book, a window and a second coffee.",
  gina: "Sea swims in any weather, loses pub quizzes on purpose, keeps every voice note you send.",
  margot: "Gallery Thursdays, natural wine, film camera always in her bag. Takes a while to open up; worth it.",
  amara: "Producer, boxer, stylist for her friends. Doesn't shrink and won't let you either.",
  luz: "Dances like it's a conversation, cooks like it's a love letter. Bronx-proud, Brooklyn-thrifted.",
  katya: "Rooftop sunsets and room-service breakfasts, but the best listener in any room.",
  jada: "Thirty-one houseplants, all named. Builds a playlist for every mood you're in.",
  valeria: "Sunlit flat, clay on her hands, mezcal on Fridays. Will argue about architecture with you, lovingly.",
};
