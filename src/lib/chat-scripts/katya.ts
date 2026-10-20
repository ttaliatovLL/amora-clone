import type { Script } from "@/lib/chat-script";

// Katya: Russian-born, Dubai rooftops, champagne taste, pilates at seven, plans trips for fun. Polished, teasing, listens closely.
export const katya: Script = {
  history: [
    {
      day: "Friday",
      lines: [
        ["her", "19:12", "Sunset on the rooftop at Address. The sky is doing that pink thing again."],
        ["me", "19:20", "Jealous. It's grey here."],
        ["her", "19:21", "Then I will describe it slowly so you suffer properly"],
        ["her", "19:24", { voice: "Okay. Gold on the water, the Burj turning orange, and a man at the next table proposing. She said yes. I cried a little. Don't tell anyone.", secs: 11 }],
        ["me", "19:30", "Your secret is safe"],
      ],
    },
    {
      day: "Yesterday",
      lines: [
        ["her", "08:05", "Pilates done. I am a new woman. A sore one."],
        ["her", "08:06", "Room service is bringing eggs and too many croissants"],
        ["me", "08:40", "Too many croissants isn't a thing"],
        ["her", "08:41", "You are right. This is why I keep you"],
        ["her", "22:10", "Tell me something about your day I wouldn't guess"],
        ["me", "22:48", "Long story. I'll tell you tomorrow"],
      ],
    },
  ],
  unread: 0,
  lastSeen: "2h ago",
  live: ["Look who finally came back", "You owe me a long story. I've been waiting all day"],
  turns: [
    [
      { say: "Okay, here's the story", her: ["Wait. Let me get comfortable", "Okay. Shoes off, glass in hand. Go, and don't skip the good part"] },
      { say: "Did you miss me?", her: ["Miss you? I barely noticed", "I only checked my phone eleven times. Normal number"], heart: true },
      { say: "What are you doing right now?", her: ["Lying on the balcony daybed, planning a trip I will probably never take", "Georgia. Wine, mountains, my grandmother's recipes. Very romantic, very unlikely"] },
    ],
    [
      { say: "Where would you take me?", her: ["Somewhere with a terrace and no wifi", "Amalfi, maybe. You would carry the bags and I would choose the restaurants. Fair system"], heart: true },
      { say: "Tell me about growing up in Russia", her: ["Snow up to my knees and a grandmother who fed me like it was a sport", "Now I live where it's forty degrees in October. I think I'm still defrosting"] },
      { say: "You plan everything, don't you?", her: ["Everything except the people", "The people always surprise me. You, for example"] },
    ],
    [
      { say: "Send me the view", her: ["Only because you asked nicely", { photo: "gallery", locked: true }, "The view is behind me. You were supposed to look at the view"] },
      { say: "Say something in Russian", her: [{ voice: "Ty mne nravishsya. No, I'm not translating. Look it up if you're brave.", secs: 7 }, "Did you look it up yet?"] },
      { say: "You're a good listener, you know", her: ["People think I just like champagne and nice hotels", "I do. But I like hearing the real version of someone more"] },
    ],
    [
      { say: "Dinner next time I'm in Dubai?", her: ["I will book the table. You will not argue about the bill", "And wear something that can handle a rooftop. Wind is not kind"], heart: true },
      { say: "I like how you tease me", her: ["Good, because I'm not stopping", "It's how I tell people I like them. Very Russian, very inconvenient"] },
      { say: "Tell me your perfect Sunday", her: ["Pilates, then back to bed. Breakfast on a tray. A long bath", "Then sunset somewhere high up with someone who actually talks to me", "You can apply for that last part"] },
    ],
  ],
  photo: ["Straight to the point. I respect that", "Fine. This is me pretending I didn't take twenty of these", { photo: "gallery", locked: true }],
  photoAgain: ["One per evening. A girl has to stay mysterious", "Ask me again tomorrow, sweetly"],
  love: "champagne",
  loveReply: ["Champagne? Now you're speaking my language", "You know this means you're officially invited to the next sunset", "I'm saving it for when you're here. Don't make me wait too long"],
  gift: (name) => [`${name}? For me?`, "That's very thoughtful. I'm a little impressed", "Careful, I could get used to this"],
  fallback: [
    ["Mm. Go on", "I'm listening, I have nowhere to be except this balcony"],
    ["Interesting. You always say things I don't expect", "That's rare here. Everyone in Dubai sounds the same after midnight"],
    ["Wait, say that part again", "I want to make sure I understood you properly"],
    ["You're trouble, aren't you", "Good. I was getting bored of polite men"],
  ],
  night: ["Already? You're lucky I like you", "Sleep well. I'll be up early for pilates, thinking of you while I suffer"],
};
