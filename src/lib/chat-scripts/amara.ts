import type { Script } from "@/lib/chat-script";

// Amara: Lagos producer, boxer, stylist for her friends, afrobeats. Loud, warm, direct, hypes you up, never shrinks.
export const amara: Script = {
  history: [
    {
      day: "Yesterday",
      lines: [
        ["her", "18:05", "just finished at the gym in yaba. coach had me on pads for an hour"],
        ["her", "18:05", "my arms are noodles. strong noodles"],
        ["me", "18:20", "who won?"],
        ["her", "18:21", "me. always me. the bag never stood a chance"],
        ["her", "23:58", { voice: "okay listen, i'm in the studio, it's almost midnight and this beat is cooking. tell me this log drum isn't sweet. tell me. you can't.", secs: 12 }],
        ["me", "00:10", "it's so good"],
      ],
    },
    {
      day: "Today",
      lines: [
        ["her", "13:40", "styled my cousin for her engagement shoot today. ankara and gold. people cried"],
        ["her", "13:41", "talk to me, what are you wearing right now"],
        ["her", "13:41", "be honest. i'll know"],
      ],
    },
  ],
  unread: 3,
  live: ["look who decided to show up", "i was about to send you a whole paragraph about the fit you clearly aren't wearing"],
  turns: [
    [
      { say: "Honestly? Sweatpants", her: ["at least you're honest", "we'll fix it. you have good bones, i can tell from here"] },
      { say: "Something you'd approve of", her: ["mm. i'll be the judge of that", "send me the fit sometime. i'm strict but i'm fair"] },
      { say: "Tell me about the shoot first", her: ["lekki, golden hour, wind doing exactly what i told it", "my cousin's fiancé saw her and forgot his own name", "that's the job. make people forget their name"], heart: true },
    ],
    [
      { say: "Play me what you're making", her: [{ voice: "this one's not finished, so don't judge. hear the shaker? that's me with a jar of rice from my mum's kitchen. don't tell her.", secs: 10 }, "if your head isn't nodding, check your pulse"] },
      { say: "How did you start boxing?", her: ["a man once told me i take up too much space", "so i learned how to take up more", "four years now. best decision of my life"] },
      { say: "Do you ever slow down?", her: ["sunday afternoons. jollof, my mum's sofa, phone face down", "that's it. that's the whole slowdown"] },
    ],
    [
      { say: "You're kind of intimidating", her: ["good. stay anyway", "i'm soft with my people. you just have to stick around long enough to be one"], heart: true },
      { say: "Show me a fit of yours", her: ["you're not ready", "okay you're ready", { photo: "gallery", locked: true }, "breathe"] },
      { say: "What's Lagos like tonight?", her: ["loud. hot. somebody's generator, somebody's party, somebody's aunty shouting", "i wouldn't live anywhere else"] },
    ],
    [
      { say: "Take me to a show in Lagos", her: ["say less", "i'll put you on the list at the next one in ikoyi. front row, near the speakers", "you're dancing. that's not a question"], heart: true },
      { say: "Teach me to throw a punch", her: ["chin down, hands up, breathe out when you hit", "and never apologise for being strong"] },
      { say: "I like how loud you are", her: ["of course you do, it's my best feature", "after the arms"] },
    ],
  ],
  photo: ["you want a photo? say please", "i'm joking. i'm already sending it", { photo: "gallery", locked: true }],
  photoAgain: ["patience", "tomorrow. i'll style something special and you'll thank me"],
  love: "vinyl",
  loveReply: ["a record?? oh you get me", "i'm sampling this. you're going in a song now", "credits and everything"],
  gift: (name) => [`${name.toLowerCase()}. look at you`, "okay, you're officially one of my people", "i'm wearing that energy all week"],
  fallback: [
    ["okay i hear you", "keep going, the beat can wait"],
    ["see, you say things", "most people just send 'lol'. i hate 'lol'"],
    ["hold on, i'm laughing", "my engineer is looking at me like i've lost it"],
    ["no shrinking", "say it again, with your chest this time"],
  ],
  night: ["go and sleep", "drink water. stretch your shoulders. wake up taking up space", "goodnight, star"],
};
