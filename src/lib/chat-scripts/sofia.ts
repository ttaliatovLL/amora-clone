import type { Script } from "@/lib/chat-script";

// Sofia: Athens and the islands, long terrace breakfasts, sunset swims, strawberries. Soft, teasing, lingers on details, a little Greek.
export const sofia: Script = {
  tz: "Europe/Athens",
  mood: "still in bed, technically",
  style: "Soft and slow, teases you, lingers on little details.",
  moment: "strawberries for breakfast again. don't judge me",
  history: [
    {
      day: "Saturday",
      lines: [
        ["her", "19:52", "the sunset on the terrace right now"],
        ["her", "19:52", "you should be here. that's all I'll say"],
        ["me", "20:10", "That's a lot to say"],
        ["her", "20:11", "I know 😌"],
      ],
    },
    {
      day: "Yesterday",
      lines: [
        ["her", "10:40", "good morning. it's almost eleven and I'm still in bed"],
        ["me", "10:45", "Lazy"],
        ["her", "10:46", "relaxed. there's a difference"],
        ["her", "10:47", "come back when you've learned it"],
      ],
    },
  ],
  unread: 1,
  live: ["there you are", "I was just thinking about you. a little"],
  turns: [
    [
      { say: "How was your day?", her: ["slow. coffee, a swim, a nap in the sun", "you'd love my days"] },
      { say: "You're beautiful", her: ["you're sweet", "say it again tomorrow, I want to see if you mean it"], heart: true },
      { say: "Tell me something about you", her: ["I can't sleep with the curtains closed", "I need the morning to find me"] },
    ],
    [
      { say: "What are you wearing?", her: ["something small, it's hot", "use your imagination. you seem good at that"], heart: true },
      { say: "What's your perfect date?", her: ["a little boat, an island with no name, fish at a taverna", "and then the long way back in the dark"] },
      { say: "Are you always this flirty?", her: ["only when someone's worth it", "so yes, right now"] },
    ],
    [
      { say: "Can I hear your voice?", her: [{ voice: "Kalimera. I'm on the terrace, there's a cat judging me from the wall. Okay, that's enough, I'm shy now.", secs: 9 }, "you're smiling, I can tell"], heart: true },
      { say: "Send me a photo", her: ["only because you asked nicely", { photo: "gallery", locked: true }, "golden hour does all the work"] },
      { say: "What's your favourite island?", her: ["the one I haven't been to yet", "and Milos. the water is unfair"] },
    ],
    [
      { say: "I wish I was there", her: ["me too", "I'd make you breakfast. slowly"], heart: true },
      { say: "You're trouble", her: ["the good kind", "mostly"] },
      { say: "I should let you go", her: ["you can try", "I'll still be here when you come back"] },
    ],
  ],
  photo: ["mm, impatient", "fine, one", { photo: "gallery", locked: true }],
  photoAgain: ["one is enough for today", "I like being missed"],
  love: "rose",
  loveReply: ["a rose?", "ok that's actually perfect. I'm putting it next to my bed"],
  gift: (name) => [`${name}? for me?`, "you're spoiling me. keep going"],
  fallback: [
    ["mm", "tell me more, I'm lying in the sun with nothing to do"],
    ["you make me laugh", "out loud. on the terrace. the cat is staring"],
    ["I read that twice", "the second time slower"],
    ["careful", "I'm starting to like you"],
  ],
  night: ["kalinychta", "sleep well. dream of somewhere warm"],
};
