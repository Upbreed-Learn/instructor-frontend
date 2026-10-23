import { https } from '@/lib/https';
import { useUserIdStore } from '@/store/user-id-control';
import { useQuery } from '@tanstack/react-query';

export type CurrencyEarnings = { totalEarning: number; monthlyEarning: number; paidOut: number; pendingPayout: number };
export type EarningsData = {
  sharePercent: number;
  byCurrency: Record<string, CurrencyEarnings>;
  currencies: string[];
  history: ({ month: string } & Record<string, number | string>)[];
  payouts: { id: number; currency: string; amount: number; note: string | null; paidAt: string }[];
};

/** The signed-in instructor's earnings from 1-1 sessions (their share, per currency). */
export const useEarnings = () => {
  const { userId } = useUserIdStore();
  return useQuery({
    queryKey: ['earnings', userId],
    queryFn: () => https.get(`/instructor/${userId}/earnings`).then(r => r.data as EarningsData),
    enabled: !!userId,
  });
};

export const money = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, notation: amount >= 100000 ? 'compact' : 'standard', maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};
