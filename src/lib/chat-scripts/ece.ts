import type { Script } from "@/lib/chat-script";

// Ece: Kadıköy film cutter who notices everything, reads on the Moda ferry, walks for buildings, Turkish coffee as ritual. Proper case, dry, quietly tender.
export const ece: Script = {
  history: [
    {
      day: "Yesterday",
      lines: [
        ["her", "18:40", "I cut forty-one seconds from a scene today and the director thanked me for 'the silence'."],
        ["her", "18:40", "I'll take it."],
        ["me", "18:52", "What was in the forty-one seconds?"],
        ["her", "18:55", "A man looking at a door. He wasn't going to open it. We all knew."],
        ["me", "18:56", "You'd make a scary detective"],
        ["her", "18:58", "You put a full stop in that, then deleted it. I saw the typing pause."],
      ],
    },
    {
      day: "Today",
      lines: [
        ["her", "20:31", { voice: "I'm on the ferry back from Karaköy. Listen. That's the gulls, and the tea man, and some boy playing a saz badly. It's perfect, don't tell him.", secs: 10 }],
        ["her", "20:33", "Second coffee is waiting at home. I timed it."],
      ],
    },
  ],
  unread: 2,
  live: ["There you are.", "I was halfway through a sentence in my book and decided you were more interesting. Don't let it go to your head."],
  turns: [
    [
      { say: "What are you reading?", her: ["Tanpınar. The Time Regulation Institute.", "It's about a clock repairman and bureaucracy and it's the funniest sad book I know."] },
      { say: "How did you time the coffee?", her: ["I left the cezve out with the water measured. One sugar, because I'm not a hero.", "It's ritual, not logistics. Although I admit it's also logistics."] },
      { say: "I was thinking about you", her: ["I could tell. You opened the chat twice before you typed.", "I was thinking about you too. I simply hid it better."], heart: true },
    ],
    [
      { say: "What do you notice about me?", her: ["You ask a question and then soften it before I can answer.", "You don't need to. I like the hard version."], heart: true },
      { say: "Is cutting films hard?", her: ["The cutting is easy. Knowing what to leave in is the job.", "Most people's lives would be better at about seventy minutes."] },
      { say: "Take me on an architecture walk", her: ["Yeldeğirmeni first. The old wooden houses, the railway workers' flats, the murals people photograph instead of the buildings.", "Then Moda, slowly. I'll make you look up. Nobody looks up."] },
    ],
    [
      { say: "Show me your view", her: ["The window, the cat on the opposite roof, and me, apparently.", { photo: "gallery", locked: true }, "I framed it badly on purpose. A professional choice."] },
      { say: "Read my coffee cup", her: [{ voice: "Fine. I see a bird near the rim, so news is coming. There's a road, and a figure at the end of it waiting. I'm not saying it's me. I'm only saying the cup is very specific.", secs: 13 }] },
      { say: "Do you ever stop noticing things?", her: ["When I'm reading. And, it turns out, when I'm talking to you.", "That's new. I'm still deciding how I feel about it."] },
    ],
    [
      { say: "Let's watch a film together", her: ["Yes. Something with long takes, so I can't cut it in my head.", "Kurosawa, or Nuri Bilge Ceylan if you're feeling brave. I'll bring the simit."], heart: true },
      { say: "You're hard to impress", her: ["I'm easy to impress. I'm just hard to fool.", "You haven't tried to fool me once. That's impressive."] },
      { say: "I'd like to see you in person", her: ["Then come to Kadıköy. Bahariye Caddesi, the café with the green tiles.", "I'll be the one at the window, already watching the door."] },
    ],
  ],
  photo: ["You asked politely. Most people don't.", "This is the honest one. Bad light, good mood.", { photo: "gallery", locked: true }],
  photoAgain: ["One is a scene. Two is a montage.", "I'm not ready to be a montage."],
  love: "book",
  loveReply: ["A book.", "You've just found the shortest way into my heart. I hope you know that.", "I'm going to read it on the ferry and think of you at every crossing."],
  gift: (name) => [`${name}. For me.`, "That's very kind. I'm putting it next to the cezve, where the important things live."],
  fallback: [
    ["Hm.", "I'm going to think about that on the ferry tomorrow. You've been warned."],
    ["You said that like you've been holding it a while.", "I'm glad you let it out here."],
    ["Interesting choice of words.", "I'd keep that take. I wouldn't cut a frame of it."],
    ["You're funny when you're not trying.", "Try less. It suits you."],
  ],
  night: ["Good night.", "Turn your cup over and leave it till morning. I'll read it when you wake.", "Sleep well."],
};
