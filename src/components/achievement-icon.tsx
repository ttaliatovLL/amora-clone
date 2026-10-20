import {
  Aperture,
  BookmarkSimple,
  CalendarCheck,
  Cards,
  ChatCircle,
  Chats,
  Crown,
  Eye,
  Gift,
  GlobeHemisphereWest,
  Moon,
  Waveform,
} from "@phosphor-icons/react/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { Achievement } from "@/lib/achievements";

const icons = { Aperture, BookmarkSimple, CalendarCheck, Cards, ChatCircle, Chats, Crown, Eye, Gift, GlobeHemisphereWest, Moon, Waveform };

export function AchievementIcon({ name, ...props }: { name: Achievement["icon"] } & IconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden {...props} />;
}
