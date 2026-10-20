import type { Metadata } from "next";
import { Legal } from "@/components/legal";

export const metadata: Metadata = { title: "Terms · Amora" };

export default function Terms() {
  return (
    <Legal
      title="Terms"
      sections={[
        ["Adults only", "Amora is for people aged 18 and over. Every companion is a fictional adult character written by our team."],
        ["Your account", "Keep your sign-in details private. You can delete your account at any time from Settings; it is erased, not hidden."],
        ["Payments", "Premium is prepaid for the period you choose and never renews on its own. Coins are for one-off unlocks and gifts and do not expire."],
        ["Conduct", "Do not use Amora to create or request content involving minors, real people without consent, or anything illegal where you live."],
        ["Changes", "If these terms change in a way that matters, we tell you in the app before it takes effect."],
      ]}
    />
  );
}
