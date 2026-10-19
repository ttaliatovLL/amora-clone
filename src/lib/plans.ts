// Prices from the current site. Annual is prepaid for 12 months; nothing auto-renews.
export const plans = {
  premium: { monthly: 19.99, annual: 13.99, coins: "1,800", perks: ["Unlimited messages", "Photos, videos and NSFW", "1,800 coins every month", "Priority replies"] },
  starter: { monthly: 12.99, annual: 8.99, coins: "1,000", perks: ["Unlimited messages", "Photos and videos", "1,000 coins every month"] },
};

export const coinPacks = [
  { coins: 150, price: 2.99 },
  { coins: 400, price: 6.99, best: true },
  { coins: 1000, price: 14.99 },
];
