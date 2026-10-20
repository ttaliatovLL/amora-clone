import type { Script } from "@/lib/chat-script";
import { amara } from "./amara";
import { anika } from "./anika";
import { ece } from "./ece";
import { emma } from "./emma";
import { gina } from "./gina";
import { jada } from "./jada";
import { katya } from "./katya";
import { klara } from "./klara";
import { luna } from "./luna";
import { luz } from "./luz";
import { margot } from "./margot";
import { valeria } from "./valeria";

/** Inbox order (most recent first) is the order here. */
export const scripts: Record<string, Script> = { emma, gina, luna, anika, ece, amara, luz, jada, valeria, klara, margot, katya };
