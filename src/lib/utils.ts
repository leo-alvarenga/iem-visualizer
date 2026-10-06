import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScreenSize() {
  const width = window.innerWidth;

  if (width < 800) {
    return "sm";
  } else if (width < 1280) {
    return "md";
  } else {
    return "lg";
  }
}
