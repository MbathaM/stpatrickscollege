import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 
 * @param inputs 
 * @returns 
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 
 * @param slug 
 * @returns 
 */
export const slugRegex = /^[a-zA-Z0-9-_]*$/;

/**
 * Get initials from a name
 * @param name - The name to get initials from
 * @returns The initials
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2) // Limit to two initials
    .join("");
};

/**
 * Get the role of a user from their email
 * @param email - The email of the user
 * @returns The role of the user
 */
export function getRoleByEmail(email: string): "student" | "teacher" {
  const firstChar = email.charAt(0);
  return /^[0-9]/.test(firstChar) ? "student" : "teacher";
}