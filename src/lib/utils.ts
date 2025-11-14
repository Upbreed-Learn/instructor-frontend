import { clsx, type ClassValue } from 'clsx';
import Cookies from 'js-cookie';
import { redirect } from 'react-router';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkAuthLoader = () => {
  const token = Cookies.get('rf');

  if (!token) {
    return redirect('/auth/login');
  }

  return { isAuthenticated: true };
};

export function formatToHMS(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}H:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
