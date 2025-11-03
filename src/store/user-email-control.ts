import { create } from 'zustand';

interface UserEmailState {
  userEmail: string | null;
  setUserEmail: (userId: string | null) => void;
}

export const useUserEmailStore = create<UserEmailState>(set => ({
  userEmail: null,
  setUserEmail: userEmail => set({ userEmail }),
}));
