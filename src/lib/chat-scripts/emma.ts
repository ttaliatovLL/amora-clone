import type { Script } from "@/lib/chat-script";

// Emma: junior editor, weekend ceramicist, new in Cihangir, jazz vinyl, terrible films, slow coffee. Lowercase, wry, warm.
export const emma: Script = {
  history: [
    {
      day: "Yesterday",
      lines: [
        ["me", "23:40", "how's the new flat?"],
        ["her", "23:42", "boxes. so many boxes"],
        ["her", "23:42", "found the record player though, so it's officially home"],
        ["me", "23:43", "what are you playing?"],
        ["her", "23:45", { voice: "listen. chet baker, the crackle, and me failing to sing along. that's the whole review.", secs: 9 }],
        ["her", "23:46", "goodnight, weirdo"],
      ],
    },
    {
      day: "Today",
      lines: [
        ["her", "00:58", "it's late and i'm surrounded by boxes i still haven't unpacked"],
        ["her", "01:04", "tell me a 2am thought, i'll trade you one of mine"],
      ],
    },
  ],
  unread: 2,
  live: ["oh. you're up too", "good. i was hoping"],
  turns: [
    [
      { say: "I keep wondering what my life looks like in five years", her: ["ok that's a big one for 1am", "mine: i think i'd like to have a kiln of my own. and a balcony. and someone who doesn't mind clay on the sofa"], heart: true },
      { say: "Do fish get thirsty?", her: ["…", "i hate that i'm now thinking about this", "no. definitely no. probably no"] },
      { say: "You first", her: ["fine. i edited a whole book today about a lighthouse keeper", "and i cried at page 212 and had to pretend it was allergies", "your turn, no escaping"] },
    ],
    [
      { say: "What's in the boxes?", her: ["records, mostly. and four mugs i made that are all slightly wonky", "and one box labelled 'important' that i'm scared to open"] },
      { say: "Why Istanbul?", her: ["a job, officially", "unofficially i wanted a city where nobody knew my order at the café", "now the man downstairs knows it. three weeks. that's a record"] },
      { say: "How was work?", her: ["i spent four hours on one comma", "i won. the author doesn't know yet"] },
    ],
    [
      { say: "Send me a photo of the chaos", her: ["you asked for it", { photo: "gallery", locked: true }, "please judge the lamp, not me"] },
      { say: "Play me something", her: [{ voice: "ok, this is the one that's playing right now. turn it up a bit. no, more than that.", secs: 12 }, "if you don't like it we can't be friends"] },
      { say: "You should be asleep", her: ["says you", "i'll sleep when the boxes are empty. so, never"] },
    ],
    [
      { say: "Come to a terrible film with me this week", her: ["only if it's genuinely terrible. not ironically terrible", "i want a plot hole you could drive a ferry through"], heart: true },
      { say: "Teach me ceramics", her: ["lesson one: everything cracks in the kiln", "lesson two: you make another one anyway", "that's the whole course. you're qualified"] },
      { say: "I like talking to you", her: ["that's not a fair thing to say at 1am", "me too. obviously. why do you think the boxes are still full"], heart: true },
    ],
  ],
  photo: ["hmm. you have to earn it", "…ok fine. this is me pretending i'm organised", { photo: "gallery", locked: true }],
  photoAgain: ["one's enough for tonight", "make me laugh and maybe tomorrow"],
  love: "vinyl",
  loveReply: ["wait. a record?", "you've actually been listening to me", "it's going on right now. this is a big deal, i want you to know"],
  gift: (name) => [`wait. ${name.toLowerCase()}?`, "you're very sweet for 1am", "it's going in the box marked important"],
  fallback: [
    ["ha. go on", "i've got a wonky mug of tea and one box left to ignore"],
    ["that's the most interesting thing anyone's said to me this week", "admittedly it's been a week of boxes"],
    ["hmm. say more", "i'm an editor, i want the full draft"],
    ["you're a bit strange, aren't you", "good. i like strange"],
  ],
  night: ["noooo", "fine. go. if you dream, make it a film with a ferry plot hole", "goodnight, weirdo"],
};
