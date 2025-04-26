import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const YT_REGEX = /(?:v=|\/)([0-9A-Za-z_-]{11})/;