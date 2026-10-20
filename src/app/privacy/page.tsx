import type { Metadata } from "next";
import { Legal } from "@/components/legal";

export const metadata: Metadata = { title: "Privacy · Amora" };

export default function Privacy() {
  return (
    <Legal
      title="Privacy"
      sections={[
        ["What we keep", "Your email, your conversations and what you unlock. Nothing else is required to use Amora."],
        ["What we never do", "We do not sell your data, show your conversations to advertisers, or put Amora's name on your bank statement."],
        ["Cookies", "Essential cookies keep you signed in and remember your age check. Analytics and personalised picks stay off unless you turn them on."],
        ["Deleting", "Delete your account in Settings and your conversations and profile are erased. Legally required payment records are kept, separated from your account."],
        ["Your rights", "You can ask for a copy of your data, correct it or erase it at any time (GDPR Articles 15 to 17)."],
      ]}
    />
  );
}
