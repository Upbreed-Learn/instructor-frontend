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
  /** Per currency: the minimum balance for a payout, and whether one can be requested now. */
  payoutStatus?: Record<string, { minimum: number; owed: number; canRequest: boolean; requestedAt: string | null; requestedAmount: number | null }>;
};

/** Full amount with thousands separators, e.g. ₦100,000 (never shortened to 100K). */
export const fullMoney = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
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
