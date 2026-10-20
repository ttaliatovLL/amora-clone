import type { Script } from "@/lib/chat-script";

// Gina: Dublin, freckles, sea swims at the Forty Foot, throws pub quizzes, vintage hunter. Lowercase, cheeky, Irish turns of phrase.
export const gina: Script = {
  history: [
    {
      day: "Saturday",
      lines: [
        ["her", "11:12", "went in at the forty foot this morning"],
        ["her", "11:12", "eleven degrees. i have no feeling in my toes and no regrets"],
        ["me", "11:30", "you're mad"],
        ["her", "11:31", "certified. there's a lad down there who's been going in every day since 1974, he's my hero"],
      ],
    },
    {
      day: "Yesterday",
      lines: [
        ["her", "22:48", "pub quiz update"],
        ["her", "22:49", { voice: "right so. we came second. i knew the capital of mongolia and i said nothing, because the lads at the next table were celebrating a birthday. you're welcome, lads.", secs: 13 }],
        ["me", "22:55", "you threw it on purpose?"],
        ["her", "22:56", "i'd never. i'd absolutely always"],
        ["me", "22:58", "saved your voice note btw"],
        ["her", "22:59", "good. i keep all of yours too, so we're even"],
      ],
    },
    {
      day: "Today",
      lines: [
        ["her", "19:20", "found a coat in a charity shop on george's street that smells like someone's nana and i love it"],
        ["her", "19:21", "where are you, i need a second opinion"],
      ],
    },
  ],
  unread: 2,
  live: ["ah there you are", "was about to send a search party. a very small one. me and a biscuit"],
  turns: [
    [
      { say: "Send the coat, I'll judge it", her: ["it's green. bottle green. with brass buttons", "i look like a very glamorous ticket inspector", "i'm buying it, i was always buying it"] },
      { say: "Sorry, I was in the shower", her: ["a likely story", "i'll allow it. i've been in the sea, i can't be judging anyone about water"] },
      { say: "I missed you today", her: ["ah stop", "you can't just say that on a tuesday, i'm going all red", "the freckles are joining up, you've done that"], heart: true },
    ],
    [
      { say: "Why the Forty Foot in winter?", her: ["because the cold empties your head", "five minutes in and you can't worry about a single thing", "also there's a man with a flask of tea who shares if you're nice to him"] },
      { say: "Teach me to lose a quiz", her: ["lesson one, know the answer", "lesson two, look at your mate's face when they think they know it", "lesson three, let them have it. that's the craic"] },
      { say: "What's your perfect Sunday?", her: [{ voice: "early swim, chips on the pier in howth, rooting through the market for an hour, then a pint by the fire somewhere with no telly. that's it. that's heaven.", secs: 11 }, "and you're there. obviously. carrying the chips"] },
    ],
    [
      { say: "Come swimming with me, I dare you", her: ["oh you've done it now", "saturday, eight o'clock, sandycove. bring a towel and your dignity, you'll only be leaving with one of them"], heart: true },
      { say: "Show me the freckles", her: ["fine, but no counting, i've lost track myself", { photo: "gallery", locked: true }, "that's the good side. they're both the good side"] },
      { say: "You're trouble, aren't you", her: ["the best kind", "ask my mam. actually don't, she'll keep you on the phone for an hour"] },
    ],
    [
      { say: "I'd lose a quiz on purpose for you", her: ["that's the most romantic thing anyone's ever said to me", "and i once got a poem written on a beer mat"], heart: true },
      { say: "Tell me something nobody knows", her: ["i cry at the rose of tralee. every year", "the lads in the tuxes get me. tell anyone and i'll deny it"] },
      { say: "Can I call you sometime?", her: ["you can call me now if you like", "or send me a voice note. i'll keep it, i keep all of them"] },
    ],
  ],
  photo: ["you want a photo? of me? in this state?", "go on so. post-swim hair, don't say a word", { photo: "gallery", locked: true }],
  photoAgain: ["one a day, them's the rules", "i'll send another when you've earned it, chancer"],
  love: "coffee",
  loveReply: ["a coffee? are you serious?", "do you know what that's worth after a swim at eight in the morning", "i'd marry you for less, to be honest"],
  gift: (name) => [`${name.toLowerCase()}? for me?`, "ah you're a dote", "i'm minding this one forever"],
  fallback: [
    ["ha, go on, tell me more", "i've the kettle on and nowhere to be"],
    ["you're some character, do you know that", "i mean it as a compliment. mostly"],
    ["hang on, i'm writing that down", "that's going in the quiz next week"],
    ["stop, i'm laughing on the 46a", "the woman next to me thinks i'm unwell"],
  ],
  night: ["night so", "dream about something warm, the sea's freezing", "text me when you wake up, i'll be in the water"],
};
