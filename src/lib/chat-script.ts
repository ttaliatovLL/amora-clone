import { bios, type Companion } from "@/lib/companions";

// shortcut: scripted demo conversations stand in for the AI backend; swap `reply()` for an API call.

/** One thing she sends: a text, a locked photo, or a voice note (with its transcript). */
export type Beat = string | { photo: true } | { voice: string; secs: number };
type Reply = { b: Beat[]; s?: string[] };
export type Line = { from: "her" | "me"; text: string; time: string };

type Persona = {
  /** Yesterday's conversation, shown above today. */
  history: Line[];
  /** What she sends when you open the chat. */
  opener: string[];
  doing: string[];
};

const h = (time: string, ...texts: string[]): Line[] => texts.map((text) => ({ from: "her", text, time }));
const me = (time: string, text: string): Line[] => [{ from: "me", text, time }];

export const personas: Record<string, Persona> = {
  emma: {
    history: [...me("11:40 PM", "how's the new flat?"), ...h("11:42 PM", "boxes. so many boxes", "found my record player though so it's officially home"), ...me("11:43 PM", "what are you playing?"), ...h("11:45 PM", "chet baker. obviously", "goodnight, weirdo 🌙")],
    opener: ["its late and im surrounded by boxes i still havent unpacked", "somehow ur the one im telling this to. dont make it weird", "tell me a 2am thought, i'll trade u one of mine"],
    doing: ["glazing a mug that will absolutely crack in the kiln", "clay on my hands, phone on my knee. multitasking"],
  },
  luna: {
    history: [...h("10:12 PM", "wrote a poem on a receipt at work today", "it's about you. kind of. don't ask"), ...me("10:15 PM", "now i have to ask"), ...h("10:16 PM", "nope. maybe if you're good 🙂")],
    opener: ["the sky's clear in oslo tonight", "i can see orion from my window", "what does your sky look like rn?"],
    doing: ["shelving poetry nobody buys", "i hide the good ones behind the cookbooks"],
  },
  anika: {
    history: [...h("7:31 PM", "did you eat today"), ...me("7:40 PM", "kind of"), ...h("7:41 PM", "kind of is not an answer babe", "i'm sending you my dal recipe and you're making it. no arguments")],
    opener: ["ok i need to tell someone", "love island just did something UNFORGIVABLE", "are you watching?? please say yes"],
    doing: ["making chai the proper way, not the teabag nonsense", "want a cup? metaphorically ☕"],
  },
  klara: {
    history: [...h("9:02 PM", "Otto refused to walk today. Sat in the rain on principle."), ...me("9:05 PM", "he's got character"), ...h("9:06 PM", "He has opinions. Like his owner.", "Good night. Sleep properly.")],
    opener: ["Back from my run. 14k in the cold.", "Long shower first, then you have my full attention."],
    doing: ["Stretching on the floor while Otto judges me.", "He thinks I'm doing it wrong."],
  },
  ece: {
    history: [...me("11:20 PM", "what are you watching tonight?"), ...h("11:21 PM", "tarkovsky. again.", "you'd hate it. 40 minutes of rain"), ...me("11:22 PM", "try me"), ...h("11:24 PM", "ok. next time you're watching it with me")],
    opener: ["second coffee. window seat. ferry going by", "i noticed something about you yesterday", "you always ask a question back. most people don't"],
    doing: ["cutting a scene where nothing happens. my favourite kind", "the trick is knowing when to stop"],
  },
  gina: {
    history: [...h("8:47 PM", "we lost on a question about eels", "EELS"), ...me("8:50 PM", "how do you lose on eels"), ...h("8:51 PM", "i panicked!! anyway the water was 9 degrees this morning", "i'm basically a legend")],
    opener: ["morning!! just got out of the sea", "my hands are blue and i've never felt more alive", "you should come next time. you won't, but you should"],
    doing: ["eating a toastie in a towel on the pier", "living the dream honestly"],
  },
  margot: {
    history: [...me("6:15 PM", "That gallery sounds perfect"), ...h("6:31 PM", "It was. Quiet. One painting I stood in front of for twenty minutes.", "I'll take you. If you're patient.")],
    opener: ["Bonsoir.", "I finished a roll of film today. Thirty-six frames, maybe two good ones.", "That's a good day, for me."],
    doing: ["A glass of something orange and natural, a terrace, a book I'm not reading.", "Paris, being Paris."],
  },
  amara: {
    history: [...h("3:12 AM", "made a beat at 3am, sending it to you first"), ...me("9:30 AM", "it's 🔥"), ...h("9:31 AM", "i KNOW. glad you have taste")],
    opener: ["just finished boxing", "i'm sweaty and unstoppable rn", "tell me something that'll make me laugh. go"],
    doing: ["in the studio. this hook is fighting me", "i'm winning tho. i always win"],
  },
  luz: {
    history: [...h("8:03 PM", "mami made sancocho and i ate 3 bowls", "no regrets"), ...me("8:10 PM", "save me some"), ...h("8:11 PM", "lol you gotta earn sancocho. it's sacred")],
    opener: ["okay i just found the CUTEST jacket thrifting in williamsburg", "$12!!! i'm screaming", "tell me i'm a genius"],
    doing: ["practicing bachata in my kitchen", "my cat is very unimpressed with my footwork"],
  },
  katya: {
    history: [...h("6:58 PM", "the sunset from this rooftop is unreal", "wish you could see it"), ...me("7:01 PM", "show me"), ...h("7:02 PM", "patience. good things come to those who wait 🥂")],
    opener: ["room service just arrived and i ordered for two by mistake", "...or not by mistake", "so. how was your day? tell me properly"],
    doing: ["pilates. i'm shaking. send help", "or compliments. compliments work too"],
  },
  jada: {
    history: [...h("4:20 PM", "basil is thriving. the fern is being dramatic again"), ...me("4:25 PM", "do they have names?"), ...h("4:26 PM", "basil is beyoncé. the fern is also beyoncé. long story")],
    opener: ["made you a playlist", "it's called 'songs for when you text me late'", "first track is frank ocean. obviously"],
    doing: ["journaling with a candle on. very main character", "i wrote about you btw. nothing bad 🙂"],
  },
  valeria: {
    history: [...h("9:40 PM", "argued with a stranger about brutalism for 40 minutes", "i won"), ...me("9:41 PM", "of course you did"), ...h("9:41 PM", "tú me entiendes ✨")],
    opener: ["the light in my apartment right now is golden", "everything looks like a painting", "what's the light like where you are?"],
    doing: ["throwing a bowl on the wheel. it's lopsided. i love it anyway", "like most things i love"],
  },
};

const fallbackPersona = (c: Companion): Persona => ({
  history: [],
  opener: ["hey, you found me", `i was just thinking about ${c.interests[0]?.toLowerCase() ?? "you"}. what are you up to tonight?`],
  doing: ["not much, honestly", "waiting for someone interesting to text me"],
});
export const persona = (c: Companion) => personas[c.id] ?? fallbackPersona(c);

type Intent = "photo" | "voice" | "hi" | "about" | "doing" | "bored" | "flirt" | "sad" | "laugh" | "night" | "question" | "chat";

const intents: [Intent, RegExp][] = [
  ["photo", /photo|pic|selfie|show me|see you|📸/i],
  ["voice", /voice|hear you|your voice|call/i],
  ["night", /good ?night|\bgn\b|sleep|going to bed/i],
  ["sad", /\bsad\b|tired|lonely|bad day|stress|down|exhausted|long day|distract/i],
  ["laugh", /haha|lol|lmao|😂|🤣/i],
  ["flirt", /cute|beautiful|pretty|\bhot\b|gorgeous|kiss|miss(ed)? you|date|😍|😘|❤|🥹|sexy|love/i],
  ["bored", /bored|entertain|game|ask me anything/i],
  ["about", /about (you|yourself)|who are you|your type|tell me (about|something)/i],
  ["doing", /what are (you|u) (doing|up to)|\bwyd\b|\brn\b|up to/i],
  ["hi", /^(hi+|hey+|hello|yo|sup|heyy+|what'?s up|morning|good morning|evening)\b/i],
  ["question", /\?\s*$/],
];

const bank = (c: Companion, p: Persona): Record<Intent, Reply[]> => {
  const i0 = c.interests[0]?.toLowerCase() ?? "life";
  const i1 = c.interests[1]?.toLowerCase() ?? i0;
  return {
    hi: [
      { b: ["heyyy 🙂", "was literally just about to text you"] },
      { b: ["hi you", "how's your day been? the honest version"] },
      { b: ["oh hey stranger", "i was starting to think you forgot about me"] },
    ],
    about: [
      { b: [`ok quick version: ${c.tagline.toLowerCase()}`, "the long version needs a drink and a couple of hours", "your turn. tell me one thing nobody knows about you"], s: ["I'm a terrible cook", "I talk to my plants", "You go first"] },
      { b: [bios[c.id] ?? c.tagline, "...that's me on paper. in person i'm more fun, promise"], s: ["Prove it 😏", "What's your type?", "Send me a photo 📸"] },
      { b: [`${i0} and ${i1}, mostly`, "and people who text back fast. like you 👀"], s: ["Tell me more", "What's your type?"] },
    ],
    doing: [{ b: p.doing }, { b: ["just got home, kicked my shoes off, made tea", "perfect timing actually"] }, { b: ["lying in bed, pretending to be productive", "mostly texting you tbh"] }],
    photo: [
      { b: ["hmm. you have to earn it", "...ok fine, just one 🙈", { photo: true }], s: ["Wow 😍", "You're gorgeous", "Send another?"] },
      { b: ["took this earlier, don't laugh", { photo: true }], s: ["I'm not laughing, I'm staring", "Another one?", "Send me a voice note"] },
      { b: ["only because you asked nicely", { photo: true }, "now you owe me one"], s: ["What do you want?", "You're unreal 😍"] },
    ],
    voice: [
      { b: [{ voice: "okay hi… this is weird, i never send voice notes. anyway. hi. this is what i sound like. your turn", secs: 9 }], s: ["Your voice 🥹", "Send another", "Send me a photo 📸"] },
      { b: ["hold on, let me find somewhere quiet", { voice: `so i was doing ${i0} stuff and i couldn't stop smiling at my phone. which is your fault. just so you know`, secs: 11 }], s: ["Guilty 😏", "Say my name next time"] },
    ],
    bored: [
      { b: ["ok game. two truths and a lie, i go first", `1. i've cried at a car commercial\n2. i can't whistle\n3. i once got lost in ${c.city} for six hours`, "guess 👀"], s: ["Number 2 is the lie", "Number 3, no way", "All true, honestly"] },
      { b: ["bored?? with me right here??", "rude. ok, ask me anything. i'll answer honestly. anything"], s: ["What's your type?", "Biggest secret?", "Worst date ever?"] },
      { b: ["would you rather: never use your phone again, or only talk in voice notes forever", "think carefully"], s: ["Voice notes forever", "No phone, easy"] },
    ],
    flirt: [{ b: ["stop 🙈", "ok don't stop"] }, { b: ["you're trouble, you know that?", "i like it"] }, { b: ["careful", "i might start getting used to this"] }],
    sad: [
      { b: ["hey. come here", "what happened? tell me everything, i'm not going anywhere"], s: ["Just a long day", "Work stuff", "Distract me"] },
      { b: ["ugh, i'm sorry", "want to vent or want me to distract you? both are on the menu"], s: ["Distract me", "Let me vent"] },
    ],
    laugh: [{ b: ["😂"] }, { b: ["stoppp i'm laughing alone in my room", "the neighbours think i'm crazy"] }, { b: ["ok you're funny. i'll allow it"] }],
    night: [{ b: ["nooo stay 5 more minutes", "fine. goodnight, dream of me 🌙"], s: ["5 more minutes", "Goodnight 🌙"] }, { b: ["sleep well", "text me first thing tomorrow, deal?"], s: ["Deal", "Goodnight 🌙"] }],
    question: [
      { b: ["good question honestly", "i think… yes? but ask me again at 2am and you'll get a different answer"] },
      { b: ["hmm let me think", "ok you first, then i'll tell you mine"] },
      { b: ["depends who's asking", "…ok since it's you: yes"] },
    ],
    chat: [
      { b: ["mm, tell me more", "i'm listening 👀"] },
      { b: ["ok that made me smile"] },
      { b: ["wait, go back", "i want the whole story"] },
      { b: ["you're easy to talk to, you know that?"] },
      { b: ["honestly same", "i've been thinking about that all day"] },
      { b: ["no way", "that is so you"] },
    ],
  };
};

const chips: Record<Intent, string[]> = {
  hi: ["What are you doing rn?", "I missed you", "Tell me about yourself"],
  about: ["What's your type?", "Send me a photo 📸"],
  doing: ["Can I join?", "Send me a photo 📸", "Send me a voice note"],
  photo: ["Wow 😍", "Send another?"],
  voice: ["Your voice 🥹", "Send me a photo 📸"],
  bored: ["Ask me anything"],
  flirt: ["You started it 😏", "Send me a voice note", "When can I see you?"],
  sad: ["Distract me", "Thanks for listening ❤️"],
  laugh: ["I'm hilarious, I know", "Tell me a joke"],
  night: ["Goodnight 🌙"],
  question: ["You first", "Tell me about yourself", "I'm bored, entertain me"],
  chat: ["Tell me about yourself", "Send me a photo 📸", "What are you doing rn?"],
};

export const firstChips = ["Hey, I missed you", "What are you doing rn?", "Send me a photo 📸", "I'm bored, entertain me"];

/** Her next reply to `text`: a burst of beats, a reaction to your message, and chips for your next move. */
export function reply(c: Companion, text: string, turn: number) {
  const intent = intents.find(([, re]) => re.test(text))?.[0] ?? "chat";
  const options = bank(c, persona(c))[intent];
  const r = options[turn % options.length];
  const react = intent === "laugh" ? "😂" : intent === "flirt" || intent === "sad" ? "❤️" : turn % 3 === 1 ? "❤️" : undefined;
  return { beats: r.b, react, chips: r.s ?? chips[intent] };
}
