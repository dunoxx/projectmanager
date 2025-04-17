import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para mesclar classes do TailwindCSS
 * Combina clsx para condicionais com tailwind-merge para resolver conflitos
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
} 