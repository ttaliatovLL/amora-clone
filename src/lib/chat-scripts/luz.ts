import type { Script } from "@/lib/chat-script";

// Luz: Bronx-born Dominican, salsa and bachata, cooks like a love letter, thrifts in Brooklyn, shoots photos. Expressive, warm, a little Spanish.
export const luz: Script = {
  history: [
    {
      day: "Saturday",
      lines: [
        ["her", "15:22", "thrift haul from bushwick, are you ready"],
        ["her", "15:23", "leather jacket, a lamp shaped like a pineapple, and a camera from 1982 for twelve dollars"],
        ["me", "15:30", "the lamp is the star here"],
        ["her", "15:31", "the lamp is family now. her name is doña piña"],
      ],
    },
    {
      day: "Yesterday",
      lines: [
        ["her", "20:10", "made sancocho tonight. my abuela's recipe, i only changed one thing and i'll never tell her"],
        ["me", "20:15", "what did you change?"],
        ["her", "20:16", "i'm not telling you either, mi amor"],
        ["her", "23:30", { voice: "okay, i just got back from the social on fordham. we danced bachata till my feet gave up. i'm so happy right now, i needed you to hear it in my voice.", secs: 12 }],
        ["me", "23:35", "you sound so happy"],
      ],
    },
    {
      day: "Today",
      lines: [["her", "18:45", "the light on the grand concourse right now is unreal. wish you were here to see it"]],
    },
  ],
  unread: 1,
  live: ["ayy there you are", "you missed it, the whole street went pink and then it was gone"],
  turns: [
    [
      { say: "I wish I was there too", her: ["ay, don't say that, i'll get soft", "next time i'm taking you on my whole route. concourse, the park, then my tía's for a cafecito"], heart: true },
      { say: "Did you take a picture?", her: ["of course i did, i always do", "a man walking his dog and the whole street gold behind him", "film, so you'll have to wait for it"] },
      { say: "How was your day?", her: ["long. but i'm home, the window's open, someone downstairs is playing marc anthony", "so now it's a good day"] },
    ],
    [
      { say: "Teach me salsa", her: ["okay first thing. stop counting so loud", "feel the one. let me lead the first song, then you lead the second", "i promise i won't laugh. much"] },
      { say: "What are you cooking tonight?", her: [{ voice: "tostones, rice, and habichuelas. the whole kitchen smells like garlic and my mother. you'd sit at my table and never want to leave.", secs: 10 }, "that's not a threat, that's a promise"], heart: true },
      { say: "Tell me about your family", her: ["loud. so loud", "my mom's from santiago, my dad's from right here, and every sunday they argue about which one is home", "they're both right"] },
    ],
    [
      { say: "Show me the thrift jacket on", her: ["only if you tell me i look good", { photo: "gallery", locked: true }, "you don't even have to say it. i know"] },
      { say: "You say everything you feel, huh", her: ["why would i hide it", "life's too short and the bronx is too loud for whispering"] },
      { say: "What's your favourite photo you took?", her: ["my abuela laughing in her kitchen, flour on her cheek", "she hates it. it's on my wall anyway"] },
    ],
    [
      { say: "Let me take you dancing", her: ["you better mean that", "friday. i'll wear the red dress. you just try to keep up"], heart: true },
      { say: "Cook for me one day?", her: ["one day? baby, i'll cook for you every day", "you just have to wash the pots. that's the deal"] },
      { say: "I'm happy I met you", her: ["ay, stop, you're making me smile at the stove", "me too. de verdad"] },
    ],
  ],
  photo: ["you want a picture? ok ok, wait, let me fix my hair", "never mind, the hair is perfect", { photo: "gallery", locked: true }],
  photoAgain: ["you already got one, papi", "the next one you have to come take yourself. i'll lend you the camera"],
  love: "rose",
  loveReply: ["a rose? ay, dios mío", "nobody does this anymore. you're old school and i love it", "it's going in a glass on my windowsill right now"],
  gift: (name) => [`stop. ${name.toLowerCase()}?`, "you're too sweet, mi amor", "doña piña is guarding it on the shelf"],
  fallback: [
    ["mmm tell me more", "i'm on the couch with a cafecito and my feet still hurt from friday"],
    ["ay, you're so funny", "my roommate just asked who i'm laughing at"],
    ["okay wait, i love that", "i'm telling my tía you said it. she's going to ask about you on sunday"],
    ["mira, i like how you say things", "plain. no games. the bronx respects that"],
  ],
  night: ["already? ay ok", "sleep well, mi amor. the light's better in the morning, i'll send you some", "buenas noches"],
};
