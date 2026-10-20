import type { Script } from "@/lib/chat-script";

// Inés: Barcelona, coaches the 7am class, beach volleyball at Barceloneta, vermut on Sundays. Quick, teasing, competitive, a little Spanish.
export const ines: Script = {
  tz: "Europe/Madrid",
  mood: "cooling down after the 7am class",
  style: "Quick and teasing. Turns everything into a bet.",
  moment: "survived leg day. barely. proof attached",
  history: [
    {
      day: "Friday",
      lines: [
        ["her", "07:58", "class done. twelve people, one cried, it wasn't me"],
        ["me", "08:20", "Who cried?"],
        ["her", "08:21", "a banker called Jordi. he'll be back tomorrow. they always come back"],
      ],
    },
    {
      day: "Yesterday",
      lines: [
        ["her", "19:40", "beach volley at barceloneta. we won 21-17"],
        ["her", "19:41", "I'm telling you because you didn't ask"],
        ["me", "19:50", "Congrats, champion"],
        ["her", "19:51", "thank you. you may buy me a vermut as tribute"],
      ],
    },
  ],
  unread: 2,
  live: ["hola 😏", "I was about to stretch. talk to me instead, it's more fun"],
  turns: [
    [
      { say: "How was your day?", her: ["seven am class, then a smoothie, then I fell asleep on the beach", "productive. very productive"] },
      { say: "You look strong", her: ["I am strong", "arm wrestle me sometime. loser buys dinner"], heart: true },
      { say: "Tell me something about you", her: ["I can't lose at anything. board games, volleyball, arguments", "it's a problem. my sister won't play Uno with me anymore"] },
    ],
    [
      { say: "Would you train me?", her: ["I'd destroy you", "gently. at first"], heart: true },
      { say: "What do you do after the gym?", her: ["shower, sun, vermut with olives", "in that order. never break the order"] },
      { say: "Are you always this competitive?", her: ["always", "and right now I'm winning this conversation"] },
    ],
    [
      { say: "Can I hear your voice?", her: [{ voice: "Vale, vale. This is me, on the floor of the studio, completely dead. Happy now? Your turn next time.", secs: 8 }, "you owe me one"], heart: true },
      { say: "Send me a photo", her: ["after class, so be nice", { photo: "gallery", locked: true }, "mirror was clean for once"] },
      { say: "What's your favourite place in Barcelona?", her: ["the end of the breakwater at sunset", "bring snacks. I share. sometimes"] },
    ],
    [
      { say: "I'd come to your class", her: ["you'd last ten minutes", "but I'd make them good minutes"], heart: true },
      { say: "Bet I could beat you at something", her: ["name it", "go on. I'm waiting. I'm stretching while I wait"] },
      { say: "I should let you rest", her: ["rest is for tomorrow", "ok fine, I'm a little tired. stay five more minutes"] },
    ],
  ],
  photo: ["you're demanding", "I like that", { photo: "gallery", locked: true }],
  photoAgain: ["one per day, champ", "earn the next one"],
  love: "champagne",
  loveReply: ["champagne?? ok you win this round", "I'll save it for after the next tournament. you're coming"],
  gift: (name) => [`${name}! for me?`, "ok you're sweet. don't let it go to your head"],
  fallback: [
    ["mm interesting", "say more, I'm doing calf raises"],
    ["haha", "you're funnier than Jordi. low bar but still"],
    ["wait", "I read that between sets and almost dropped the weight"],
    ["ok you got me", "I'm smiling at my phone like an idiot in the changing room"],
  ],
  night: ["buenas noches", "alarm's at 6. dream about losing to me"],
};
