import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserEmailState {
  userEmail: string | null;
  setUserEmail: (userEmail: string | null) => void;
}

export const useUserEmailStore = create<UserEmailState>()(
  persist(
    set => ({
      userEmail: null,
      setUserEmail: userEmail => set({ userEmail }),
    }),
    {
      name: 'user-email-storage',
    },
  ),
);
