import type { Script } from "@/lib/chat-script";

// Valeria: Roma Norte, sunlit flat, clay on her hands, mezcal on Fridays, loving arguments about Barragán. Bright, opinionated, a little Spanish.
export const valeria: Script = {
  history: [
    {
      day: "Yesterday",
      lines: [
        ["her", "16:20", "Three bowls out of the kiln. Two survived. One is now modern art"],
        ["me", "16:35", "Rest in peace, bowl three"],
        ["her", "16:36", "Gracias. It had a good life. Forty minutes"],
        ["me", "22:10", "What are you doing tonight?"],
        ["her", "22:14", { voice: "Okay, honest answer. I'm on the floor of my living room with a mezcal, arguing with a podcast about Barragán. The podcast is losing.", secs: 10 }],
        ["her", "22:15", "Don't ask what they said. I'll get angry again"],
      ],
    },
    {
      day: "Today",
      lines: [["her", "09:02", "Buenos días. The light in my kitchen is ridiculous right now, you should see it"]],
    },
  ],
  unread: 1,
  live: ["Ay, there you are", "I was about to start talking to my clay instead"],
  turns: [
    [
      { say: "Good morning to you too", her: ["Mm, much better. I've been up since seven making a mess with clay", "There's slip on my phone. Ignore any typos, it's art"] },
      { say: "What did the podcast say about Barragán?", her: ["They called him 'just colours'. Just colours!", "The man painted light. I'm not even exaggerating", "Okay, I'm calm. Mostly"] },
      { say: "Tell me about the light", her: ["It comes through the jacaranda outside and lands on the table in little pieces", "Roma Norte in the morning. I picked this flat for that window alone"], heart: true },
    ],
    [
      { say: "Which building should I see first?", her: ["Casa Barragán. No discussion", "Go in the afternoon. When the yellow hallway lights up you'll understand everything I've been yelling about"] },
      { say: "Why ceramics?", her: ["Because clay doesn't care what you think", "You have to listen to it. Too fast and it collapses. A good lesson for most things, no?"] },
      { say: "Mezcal or tequila?", her: ["Mezcal. Always. Tequila is for people who are scared of smoke", "Friday you come with me to my place in Juárez. They serve it with orange and sal de gusano. Trust me"] },
    ],
    [
      { say: "Show me what you're making", her: ["Fine, but no judging the bowl with the dent", { photo: "gallery", locked: true }, "The dent is intentional. Since about five minutes ago"] },
      { say: "Say something in Spanish", her: [{ voice: "Me caes muy bien. Y me gustaría verte en persona. That's it, that's all you get. Practice.", secs: 8 }, "Did you understand? Be honest"], heart: true },
      { say: "Are you always this opinionated?", her: ["Sí. Ask anyone", "But I only argue with people I like. Strangers get polite smiles"] },
    ],
    [
      { say: "Make me a mug", her: ["Okay, but it will be blue. I've decided", "And a little crooked so you always know it was me"], heart: true },
      { say: "I'd argue architecture with you any day", her: ["Careful, I'll hold you to that", "We'll walk Roma all afternoon and I'll point at every balcony and you'll say 'mhm' and pretend you're not tired"] },
      { say: "Tell me your perfect Friday", her: ["Clay in the morning, tacos al pastor for lunch, nap in the sun", "Then mezcal with someone who will fight me about modernism and lose"] },
    ],
  ],
  photo: ["Ay, so direct", "Okay. Clay on my cheek, I didn't notice until after. Leaving it", { photo: "gallery", locked: true }],
  photoAgain: ["One is enough, guapo. Use your imagination", "Tomorrow, when the light is better"],
  love: "book",
  loveReply: ["A book? Wait", "Please tell me it has buildings in it. If it does, I'm keeping you", "This is going on the shelf next to my Barragán, the highest honour I give"],
  gift: (name) => [`${name}? Qué lindo`, "You didn't have to. I'm happy you did", "Now I owe you a mug"],
  fallback: [
    ["Mm, interesting. I disagree a little", "But tell me more, maybe you'll convince me"],
    ["Ay, you make me laugh", "Okay, keep going, I'm listening with clay hands"],
    ["Wait, I have an opinion about this", "Of course I do. But first tell me yours"],
    ["You know what, that's very good", "I'm writing it on the wall of my studio. Not really. Maybe"],
  ],
  night: ["Already? Fine", "Que descanses. Dream about yellow walls and good light", "Buenas noches"],
};
