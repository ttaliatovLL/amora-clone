import type { Script } from "@/lib/chat-script";

// Margot: Paris, composed and private, gallery Thursdays, natural wine, a film camera in her bag. Proper case, few words, a little French.
export const margot: Script = {
  history: [
    {
      day: "Thursday",
      lines: [
        ["her", "20:14", "I went to the gallery on rue de Turenne."],
        ["her", "20:15", "One painting. Just blue. I stood there for twenty minutes."],
        ["me", "20:30", "Was it good?"],
        ["her", "20:41", "I don't know yet. That's usually a good sign."],
      ],
    },
    {
      day: "Yesterday",
      lines: [
        ["me", "21:02", "What are you doing tonight?"],
        ["her", "21:40", "A small bar in the eleventh. A glass of something orange and cloudy."],
        ["her", "21:41", "The owner chooses for me. I let him."],
        ["me", "21:45", "Trusting of you"],
        ["her", "21:52", "Only with wine."],
      ],
    },
  ],
  unread: 0,
  lastSeen: "2h ago",
  live: ["Bonsoir.", "I was thinking I might write to you. You were faster."],
  turns: [
    [
      { say: "How was your day?", her: ["Quiet. I developed a roll of film I shot in August.", "Half of it is ruined. The other half is worth it."] },
      { say: "I like how you write", her: ["I don't write much.", "Maybe that's why."], heart: true },
      { say: "Tell me something about you", her: ["You're impatient.", "Fine. I sleep with the window open, even in January."] },
    ],
    [
      { say: "What's on your camera right now?", her: ["A Pentax my father left in a drawer.", "Twenty-four exposures. I'm on eleven. I don't rush it."] },
      { say: "Recommend me a French film", her: ["Cléo de 5 à 7. Agnès Varda.", "Two hours of a woman walking through Paris, waiting.", "Watch it alone. Then tell me."] },
      { say: "Why are you so hard to read?", her: ["I'm not hard to read.", "I'm just written slowly."] },
    ],
    [
      { say: "Can I hear your voice?", her: [{ voice: "Bon. This is my voice. I'm on the balcony, there's a scooter somewhere below. Don't make me do this often.", secs: 9 }, "Now you know."], heart: true },
      { say: "Take a photo for me", her: ["I'll use the last frame of the day.", { photo: "gallery", locked: true }, "Not the film one. That one stays with me."] },
      { say: "What are you drinking?", her: ["A pét-nat from the Loire. It tastes like apples left in the sun.", "You would like it. Or you would pretend to."] },
    ],
    [
      { say: "Show me your Paris one day", her: ["Perhaps.", "A Thursday. A gallery, then the bar, then the long way home along the canal.", "If you can walk without talking."], heart: true },
      { say: "Do you ever let anyone in?", her: ["Eventually.", "Ask me again in a month. You might be surprised."] },
      { say: "I should let you sleep", her: ["You're not keeping me up.", "But it's kind that you thought of it."] },
    ],
  ],
  photo: ["You ask very directly.", "D'accord. Just this one.", { photo: "gallery", locked: true }],
  photoAgain: ["One is enough.", "I prefer to be missed a little."],
  love: "wine",
  loveReply: ["Oh.", "You remembered. Natural, I hope.", "Then you're invited to help me finish it. One day."],
  gift: (name) => [`${name}. Merci.`, "That's thoughtful.", "I'll keep it close."],
  fallback: [
    ["Continue.", "Slowly. I read everything twice."],
    ["I read that on the stairs and stopped walking.", "I don't always reply quickly. It doesn't mean I'm not thinking about it."],
    ["Mm.", "I'll take that with me to the gallery tomorrow. In front of the blue one."],
    ["You made me smile.", "In public. On the terrace. I had to look at my wine."],
  ],
  night: ["Bonne nuit.", "Sleep well. Write to me tomorrow."],
};
