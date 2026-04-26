import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mulberry32 seeded PRNG — deterministic question generation for duels
export function seededRandom(seed: number): () => number {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function buildWhatsAppInvite(friendCode: string): string {
  const appUrl = "https://verbumflowapp.web.app";
  const addLink = `${appUrl}/?addFriend=${friendCode}`;
  const message = encodeURIComponent(
    `¡Juega VerbumFlow conmigo! 🇫🇷 Agrégame con mi código *${friendCode}* o haz clic aquí para añadirme directamente: ${addLink}`
  );
  return `https://wa.me/?text=${message}`;
}
