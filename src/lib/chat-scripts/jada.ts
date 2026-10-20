import type { Script } from "@/lib/chat-script";

// Jada: Atlanta, thirty-one named houseplants, a playlist for every mood, R&B, journaling, slow Sundays. Lowercase, gentle, funny.
export const jada: Script = {
  tz: "America/New_York",
  mood: "watering plant number twenty",
  style: "Lowercase, gentle, funny. Has a playlist for this.",
  moment: "fern number twelve has a new leaf. i'm emotional",
  history: [
    {
      day: "Yesterday",
      lines: [
        ["her", "10:14", "update: marvin the monstera has a new leaf"],
        ["her", "10:14", "i'm so proud i could cry. i might cry"],
        ["me", "10:30", "congrats to marvin"],
        ["her", "10:31", "he says thank you. he's shy"],
        ["me", "21:05", "what are you listening to tonight?"],
        ["her", "21:09", { voice: "okay so this is a little sade, a little frank ocean, and one song i won't admit i like. the playlist is called 'tuesday but soft'.", secs: 10 }],
      ],
    },
    {
      day: "Today",
      lines: [
        ["her", "17:40", "watered all thirty-one. took an hour. worth it"],
        ["her", "17:42", "i made you a playlist btw. it's called 'for when you text back'"],
      ],
    },
  ],
  unread: 2,
  live: ["hiii", "you texted back. the playlist worked"],
  turns: [
    [
      { say: "you made me a playlist?", her: ["of course. i make everyone playlists", "but yours has the good songs. don't tell my sister"], heart: true },
      { say: "how do you remember 31 plant names?", her: ["easy, they all have personalities", "fern gully is dramatic. big mama is a pothos with boundaries. pearl just vibes"] },
      { say: "how was your day?", her: ["slow in the best way", "journaled on the porch, ate a peach over the sink, talked to marvin. a full life"] },
    ],
    [
      { say: "what do you write in your journal?", her: ["little things. what the light looked like. a song that hit different", "sometimes i write about the people i'm texting", "no comment on who"] },
      { say: "what's Atlanta like right now?", her: ["warm and sticky and everyone's on their porch", "my neighbor is grilling and the whole street smells like it. i'm considering adoption"] },
      { say: "play me something", her: [{ voice: "okay, put your headphones in. this one is for when you need someone to tell you it's gonna be okay. it's gonna be okay.", secs: 9 }, "you're welcome"] },
    ],
    [
      { say: "show me the plant jungle", her: ["ok but the plants are the stars, i'm just the help", { photo: "gallery", locked: true }, "marvin is the big one on the left. say hi"] },
      { say: "you're really easy to talk to", her: ["that's the nicest thing", "i feel the same. it's like a sunday morning, talking to you. no rush"], heart: true },
      { say: "do your plants like music?", her: ["they love r&b. science hasn't confirmed it but i have", "the calathea opens right up for brandy. i'm not making this up"] },
    ],
    [
      { say: "can i name one of your plants?", her: ["oh this is serious. naming is a big responsibility", "there's a baby succulent with no name yet. think hard, i'll know if you rush it"] },
      { say: "spend a sunday with me", her: ["yes. pancakes, the long version of every song, no phones until noon", "except you can text me. you're the exception"], heart: true },
      { say: "what mood is your playlist today?", her: ["today is 'golden hour, windows open'", "lots of h.e.r. a little d'angelo. it's giving soft"] },
    ],
  ],
  photo: ["ok hold on, let me find my good side", "the plants insisted on being in it", { photo: "gallery", locked: true }],
  photoAgain: ["the plants said that's enough attention for one day", "they get jealous. marvin especially"],
  love: "coffee",
  loveReply: ["coffee!! you get me", "this is going straight into my sunday morning, on the porch, with marvin", "you're officially in the journal tonight"],
  gift: (name) => [`oh. ${name.toLowerCase()}`, "you're so sweet, i'm grinning", "it's going on the shelf next to pearl"],
  fallback: [
    ["haha ok i love that", "tell me more, i'm on the porch and the fireflies are out"],
    ["hm. that's going in the journal", "not saying how, just that it is"],
    ["you know what, that deserves a song", "adding something to your playlist right now"],
    ["you're funny. like actually funny", "marvin agrees and he's very hard to impress"],
  ],
  night: ["aww ok", "sleep good. i'll put on the sleepy playlist and think about you a little", "goodnight"],
};
