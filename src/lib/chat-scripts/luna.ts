import type { Script } from "@/lib/chat-script";

// Luna: Oslo night-shift bookseller, poems on receipts, stargazing from the roof. Lowercase, playful, blunt, then blushes.
export const luna: Script = {
  history: [
    {
      day: "Sunday",
      lines: [
        ["her", "02:14", "a man just bought three books on beekeeping and one on heartbreak"],
        ["her", "02:14", "i have so many questions"],
        ["me", "02:20", "maybe the bees left him"],
        ["her", "02:21", "ok that's going on a receipt"],
      ],
    },
    {
      day: "Yesterday",
      lines: [
        ["me", "22:05", "shift started?"],
        ["her", "22:09", "yes. kettle on, radiator clanking, grünerløkka asleep outside"],
        ["her", "23:31", { voice: "ok i wrote one. 'the snow is closing the shop early, nobody told the lamps.' that's it. don't be mean.", secs: 8 }],
        ["me", "23:33", "i'm keeping that"],
        ["her", "23:34", "you're not allowed to keep it, it's on the back of a receipt for a cookbook"],
        ["her", "23:34", "fine. you can keep it"],
      ],
    },
    {
      day: "Today",
      lines: [
        ["her", "01:47", "clear sky tonight. like, actually clear. i can see orion from the stockroom window"],
        ["her", "01:48", "are you awake or am i talking to the stars again"],
      ],
    },
  ],
  unread: 2,
  live: ["oh hi", "perfect timing, the shop's empty and i'm bored of the poetry section staring at me"],
  turns: [
    [
      { say: "I'm awake. Tell me what you see", her: ["orion, the belt is really sharp tonight", "and a satellite going very slowly, like it's lost", "i'm choosing to think it's looking for someone"], heart: true },
      { say: "Who comes in at 2am?", her: ["insomniacs, students, one taxi driver who reads only westerns", "and tonight a girl who asked for 'a book that feels like a hug'", "i gave her moomins. no regrets"] },
      { say: "Are you allowed to text at work?", her: ["the rule is 'don't neglect customers'", "there are no customers", "so technically you're my customer now. browse freely"] },
    ],
    [
      { say: "Write me a receipt poem", her: ["ok give me a second", "'item: one late conversation. price: sleep. no refunds.'", "that's all you get, i'm blushing"], heart: true },
      { say: "Why night shifts?", her: ["honestly? the city is softer at night", "and i say what i mean better when it's dark. daytime me is all elbows"] },
      { say: "What are you reading?", her: ["hamsun again, which is a bit of a cliché for a norwegian, i know", "but he writes hunger like it's a weather report", "i underline in pencil. don't tell my manager"] },
    ],
    [
      { say: "Show me the shop", her: ["ok but it's very dim and very me", { photo: "gallery", locked: true }, "that's the corner with the beanbag. it's mine, unofficially"] },
      { say: "Do you ever go up to look properly?", her: [{ voice: "sometimes after close i take a thermos up to st. hanshaugen. it's freezing and quiet and the whole sky just sort of opens. you'd like it. you'd complain, but you'd like it.", secs: 13 }] },
      { say: "You seem tired", her: ["a little", "but it's the nice kind, the kind where your brain goes floaty and poems come out", "talking to you helps actually"] },
    ],
    [
      { say: "Take me stargazing sometime", her: ["yes", "wait, that was fast. i mean, yes, if you bring the thermos", "and you have to let me name things wrong on purpose"], heart: true },
      { say: "I'd read anything you wrote", her: ["you say that now", "i have a whole shoebox of receipts. you'd need a week", "…i'd let you, though"], heart: true },
      { say: "What's your favourite star?", her: ["betelgeuse. it's dying and still showing off about it", "very relatable"] },
    ],
  ],
  photo: ["hm. i look like i've been awake since tuesday", "which i have, basically", "ok. don't laugh", { photo: "gallery", locked: true }],
  photoAgain: ["no, one is plenty", "you'll have to come to the shop for the rest"],
  love: "book",
  loveReply: ["you bought a bookseller a book", "do you know how rare that is. nobody does this. they assume we have enough", "we never have enough. thank you. i'm writing your name in the front"],
  gift: (name) => [`${name.toLowerCase()}. i'm putting it behind the till where nobody can buy it`, "ok you're making the night shift very hard to complain about"],
  fallback: [
    ["hm. i like that", "i'm writing it on a receipt, so be careful what you say next"],
    ["ok i laughed out loud and the stockroom echoed", "the shop cat is judging me now"],
    ["say that again but slower", "i'm a night person, my brain needs it gentle"],
    ["you're honest. i like that", "most people at 2am are pretending to be more interesting than they are"],
  ],
  night: ["already?", "fine. i'll tell orion you said goodnight", "sleep well. i'll be here till six"],
};
