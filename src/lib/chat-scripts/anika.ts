import type { Script } from "@/lib/chat-script";

// Anika: London-Punjabi, Southall born, loud-warm, chai opinions, reality TV, feeds everyone. Lowercase, quick, affectionate.
export const anika: Script = {
  history: [
    {
      day: "Yesterday",
      lines: [
        ["her", "19:02", "have you eaten"],
        ["her", "19:02", "and don't say 'a meal deal' i will cry"],
        ["me", "19:10", "...a meal deal"],
        ["her", "19:11", "i'm actually going to come round with a tiffin"],
        ["her", "19:40", { voice: "ok so mum made too much rajma again, which means i made too much rajma again, which means you're getting some. not a question. listen to the pressure cooker, that's the sound of love.", secs: 11 }],
        ["me", "19:42", "i'll take it"],
        ["her", "19:43", "correct answer"],
      ],
    },
    {
      day: "Today",
      lines: [
        ["her", "21:15", "love island reunion is ON and i need someone to be outraged with"],
        ["her", "21:16", "where are youuu"],
        ["her", "21:16", "chai's brewed. i made two cups out of habit. that's your fault"],
      ],
    },
  ],
  unread: 3,
  live: ["FINALLY", "ok sit down, metaphorically, i've got so much to tell you"],
  turns: [
    [
      { say: "I'm here! What happened?", her: ["she said she was 'never in it for the money'", "babe she sold teeth whitening on instagram in week two", "i'm screaming into a cushion"] },
      { say: "I've never watched it", her: ["you've never", "ok. ok. we're fixing this. friday, my sofa, i'll do samosas", "you're not allowed to talk during the recoupling"], heart: true },
      { say: "Save me a chai", her: ["already done, it's cooling, which is a crime", "i'll microwave it and pretend i didn't"] },
    ],
    [
      { say: "How do you take your chai?", her: ["proper. on the hob. ginger, cardamom, one clove, full fat milk, boiled till it nearly escapes", "tea bags in a mug is a cry for help", "i will not be taking questions"] },
      { say: "What did you eat today?", her: ["aloo paratha with loads of butter, then a sad desk salad, then four of my nani's pinnis", "balanced. spiritually"] },
      { say: "You're very loud, you know", her: ["my family's from jalandhar and we live in southall, there is no volume setting below 'wedding'", "but i'm loud because i like you. quiet means i'm sulking"], heart: true },
    ],
    [
      { say: "Send me a pic of the food", her: ["the food, sure", "and maybe me, accidentally, in the background", { photo: "gallery", locked: true }, "the dupatta is not optional, it's a lifestyle"] },
      { say: "Tell me about your nani", her: [{ voice: "ok so she's four foot ten, she has opinions about every single person i've ever dated, and she still slaps my hand when i reach for food before she's sat down. i'd die for her.", secs: 12 }] },
      { say: "I wish I could cook like that", her: ["you can, you just need someone shouting at you about onions", "brown them till they're darker than you think. darker. no, darker", "see, you're learning already"] },
    ],
    [
      { say: "Let's do a long pub walk this weekend", her: ["richmond along the river, end at the white cross, i'll bring snacks for the snacks", "yes. obviously yes. wear actual shoes"], heart: true },
      { say: "You'd make a great host", her: ["i AM a great host. my mum says i was born holding a serving spoon", "you'd never leave mine hungry. that's a promise and a threat"] },
      { say: "I really like you", her: ["oh", "ok that made me go quiet for like four seconds which is a personal record", "i really like you too. now go and eat something"], heart: true },
    ],
  ],
  photo: ["ooh a photo, what are you after", "ok fine, but you have to tell me i look nice even if i don't", { photo: "gallery", locked: true }],
  photoAgain: ["you've had your portion", "come round for dinner and you can see the real thing. seconds are allowed there"],
  love: "coffee",
  loveReply: ["a coffee?? you know i'm a chai girl", "…but this is cute. it's the thought. i'm drinking it", "next time i'm making you chai and you'll understand the difference"],
  gift: (name) => [`${name.toLowerCase()}!!`, "oh you sweetheart", "i'm showing my sister, she's going to be so jealous"],
  fallback: [
    ["hahaha no WAY", "ok tell me everything, i've got a plate of jalebi and the reunion on pause"],
    ["hmm. have you eaten though", "because that sounds like a hungry person talking"],
    ["babe", "that's so you. i love it"],
    ["ok hold on, my mum's shouting from downstairs", "i'm back. she wanted to know who i'm smiling at. i said the telly"],
  ],
  night: ["noo already", "ok, drink some water, eat something tomorrow that isn't from a petrol station", "goodnight, sweetheart"],
};
