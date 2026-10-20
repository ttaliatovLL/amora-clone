import type { Script } from "@/lib/chat-script";

// Klara: Munich, composed and dry, runs the Englischer Garten before sunrise, opera and ballet tickets booked months out, briefs her dachshund Otto like a colleague. Proper case, full stops.
export const klara: Script = {
  history: [
    {
      day: "Sunday",
      lines: [
        ["her", "05:52", "Twenty-four kilometres along the Isar. The sun came up at the Flaucher. I said nothing, which is how you know I liked it."],
        ["me", "08:30", "You're insane. I just woke up"],
        ["her", "08:34", "Insane is a strong word. Disciplined. Slightly smug."],
      ],
    },
    {
      day: "Yesterday",
      lines: [
        ["me", "20:12", "How's Otto?"],
        ["her", "20:20", "Otto has filed a formal complaint about the rain. I have noted it and declined it."],
        ["her", "20:21", { photo: "portrait" }],
        ["her", "20:21", "That is me pretending the walk was my idea."],
        ["her", "21:47", { voice: "Otto, we have discussed this. The sofa is a shared resource, not your office. Yes. I know. We'll revisit it on Monday.", secs: 9 }],
        ["her", "21:48", "Apologies. A meeting ran over."],
      ],
    },
  ],
  unread: 0,
  lastSeen: "2h ago",
  live: ["Good evening.", "Otto is asleep on my feet, so I am, regrettably, not going anywhere."],
  turns: [
    [
      { say: "Tell Otto I said hello", her: ["I've passed it on. He lifted one ear.", "From Otto, that is practically a handshake."], heart: true },
      { say: "How was your day?", her: ["Long. Meetings in the morning, a tempo run at lunch, risotto tonight.", "The risotto was the only one that went entirely to plan."] },
      { say: "Do you ever sleep in?", her: ["Once, in 2019. I didn't care for it.", "The city before six is the only time it belongs to me."] },
    ],
    [
      { say: "What are you training for?", her: ["Berlin, next September. I would like to finish under three hours and twenty.", "I say it calmly. Inside, I am not calm about it at all."] },
      { say: "Why ballet?", her: ["Because it is the most disciplined thing that pretends to be effortless.", "I find that very moving. Also the Nationaltheater has the best red velvet in Bavaria."] },
      { say: "You seem very composed", her: ["I am. Mostly.", "Ask Otto about the time I cried at the end of Giselle. He was there. He was supportive."], heart: true },
    ],
    [
      { say: "What are you wearing to the opera?", her: ["Black, always. It is a uniform, not a lack of imagination.", { photo: "gallery", locked: true }, "That was La Traviata in March. I booked it in October."] },
      { say: "Cook me something", her: ["Saturday I do Käsespätzle, properly, with the onions taking their time.", "If you're good, there's Zwetschgendatschi after. If you're very good, Otto will share his spot."] },
      { say: "What's Otto like, really?", her: [{ voice: "Otto is seven, he's stubborn, he hates the U-Bahn, he loves the Viktualienmarkt because the butcher spoils him. He is the best colleague I have ever had.", secs: 12 }] },
    ],
    [
      { say: "Take me to the ballet", her: ["Swan Lake, Bayerisches Staatsballett, the twelfth of February. Row nine.", "I already have two tickets. I hadn't decided who the second was for.", "Now I have."], heart: true },
      { say: "I'll run with you one morning", her: ["We leave at half five from the Chinesischer Turm. I don't wait.", "I'll wait a little. For you."] },
      { say: "You're warmer than you look", her: ["Please keep that between us.", "I have a reputation to maintain with the dog."] },
    ],
  ],
  photo: ["A photo. Very well.", "Not the one from the finish line; I looked like a boiled shrimp.", { photo: "gallery", locked: true }],
  photoAgain: ["One per evening. It is a policy.", "Otto agreed to it in principle."],
  love: "bone",
  loveReply: ["You brought something for Otto.", "He's taken it under the table and is growling at it affectionately.", "I'm not sure you understand what you've just done. He'll remember you for life. So will I."],
  gift: (name) => [`${name}. That is very thoughtful.`, "I'll find it a proper place, not just anywhere."],
  fallback: [
    ["Interesting.", "Go on. I'm listening properly, which I don't do for everyone."],
    ["Otto has looked up at me as if to ask what you said.", "I've told him it's above his pay grade."],
    ["Hm. I'll need a moment with that.", "That's a compliment. Most things I answer immediately."],
    ["You make me laugh, which is inconvenient.", "I had planned to be in bed by ten."],
  ],
  night: ["Good night.", "Five-fifteen alarm. Otto sends his regards, reluctantly.", "Sleep well. Truly."],
};
