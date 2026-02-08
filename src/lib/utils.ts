import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fusionne les classes Tailwind avec support des overrides.
 * Utilisé par tous les composants shadcn/ui et les composants custom.
 * @see https://ui.shadcn.com/docs/installation
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
