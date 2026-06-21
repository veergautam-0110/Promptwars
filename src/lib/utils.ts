import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_COLORS: Record<string, string> = {
  transport: '#3b82f6', // blue
  food: '#10b981', // emerald
  energy: '#f59e0b', // amber
  shopping: '#8b5cf6', // violet
  waste: '#64748b', // slate
  water: '#0ea5e9', // sky
};

export const EMISSION_FACTORS: Record<string, number> = {
  car_km: 0.17, // kg CO2 per km
  flight_km: 0.15,
  meat_meal: 6.0,
  veg_meal: 1.5,
  electricity_kwh: 0.4,
  electronics_item: 15.0,
  fashion_item: 8.0,
  household_item: 3.0,
  recyclable_kg: 0.2, // low impact if recycled
  landfill_kg: 2.5, // high impact
  water_liter: 0.001, // negligible per liter but tracks usage
};
