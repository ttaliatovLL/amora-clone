import type { Companion } from "@/lib/companions";

// Dev-only worst-case fixture for break-ui checks on /system. Plausible values, spread across rows.
export const worstCompanions: Companion[] = [
  { id: "w1", name: "Anastasia-Valentina", age: 34, city: "Saint-Jean-sur-Richelieu", tagline: "Former ballet dancer turned architecture photographer who still practises pliés while the kettle boils", traits: ["Warm under the composure, fiercely private about it", "Curious"], interests: ["Brutalist architecture walks at dawn", "Film"], vibe: "Mysterious", online: true, isNew: true, hair: "bun", wash: ["#b9a0b8", "#2b1c2e"], tags: ["architecturephotography", "brutalism", "pliés", "kettle"], sign: "Sagittarius", langs: ["FR", "EN", "IT", "DE"], photos: 1284, gallery: [] },
  { id: "w2", name: "Jo", age: 19, city: "Ōsaka", tagline: "hi", traits: ["Shy"], interests: [], vibe: "Sweet", online: false, hair: "bob", wash: ["#a9837a", "#221416"], tags: [], sign: "Leo", langs: ["JA"], photos: 0, gallery: [] },
  { id: "w3", name: "Nguyễn Thị Ánh", age: 26, city: "Hà Nội", tagline: "Phở at 2am, poetry at 3, regrets never", traits: ["Ấm áp", "Playful"], interests: ["Cà phê trứng", "Đà Lạt road trips"], vibe: "Playful", online: true, hair: "straight", wash: ["#d39a62", "#3d1d18"], tags: ["phở", "thơ", "đàlạt"], sign: "Virgo", langs: ["VI", "EN"], photos: 7, gallery: [] },
  { id: "w4", name: "Maximiliane", age: 41, city: "Garmisch-Partenkirchen", tagline: "Zoë-Saldaña lookalike, apparently 🙄✨ — loves https://www.instagram.com/explore/tags/mountainsunrise", traits: ["Bold"], interests: ["Ski touring", "Schnitzel"], vibe: "Bold", online: true, hair: "wavy", wash: ["#d68a5c", "#3f1a12"], tags: ["🙄✨", "skitouring", "schnitzel"], sign: "Capricorn", langs: ["DE"], photos: 99999, gallery: [] },
];

export const worstMessage =
  "omg look at this https://www.example-booking-site.com/hotels/lisbon/rooms?checkin=2026-11-14&checkout=2026-11-16&guests=2&ref=amora-chat-share-link 😍😍😍";
export const worstCoins = 1284560;
