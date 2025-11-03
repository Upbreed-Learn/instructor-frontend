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
