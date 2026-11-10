import { Card, CardTitle, Lines, Segmented, money, shortMoney } from '@/components/dash';
import type { UserDetailsType } from '@/lib/constants';
import { useEarnings } from '@/lib/earnings';
import { https } from '@/lib/https';
import { cn } from '@/lib/utils';
import { useGetUserDetails } from '@/queries/hooks';
import { useUserIdStore } from '@/store/user-id-control';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleCheck, Landmark, TriangleAlert } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { Link } from 'react-router';
import { toast } from 'sonner';

const MINIMUM: Record<string, number> = { NGN: 100_000, USD: 100 };
const date = (iso: string) => new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });

const Earnings = () => {
  const { data, isPending, isError } = useEarnings();
  const { userId } = useUserIdStore();
  const me: UserDetailsType | undefined = useGetUserDetails(userId!!).data?.data?.data;
  const currencies = data?.currencies.length ? data.currencies : ['NGN'];
  const [currency, setCurrency] = useQueryState('currency', { defaultValue: 'NGN' });
  const cur = currencies.includes(currency) ? currency : currencies[0];
  const e = data?.byCurrency[cur] ?? { totalEarning: 0, monthlyEarning: 0, paidOut: 0, pendingPayout: 0 };
  const queryClient = useQueryClient();
  const status = data?.payoutStatus?.[cur] ?? { minimum: MINIMUM[cur] ?? 100, owed: e.pendingPayout, canRequest: false, requestedAt: null, requestedAmount: null };
  const progress = Math.min(100, Math.round((status.owed / status.minimum) * 100));
  const bank = me?.instructorProfile;
  const hasBank = Boolean(bank?.bank && bank?.accountNo);

  const request = useMutation({
    mutationFn: () => https.post('/instructor/me/payout-request', { currency: cur }).then(r => r.data.message as string),
    onSuccess: message => {
      toast.success('Payout requested', { description: message });
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
    },
    onError: (err: { response?: { data?: { message?: string } }; message?: string }) => toast.error('Could not request a payout', { description: err?.response?.data?.message || err?.message }),
  });

  const months = data?.history ?? [];
  const payouts = (data?.payouts ?? []).filter(p => p.currency === cur);

  if (isError) {
    return <p className="pt-10 text-sm text-[#A3262A]">We couldn&apos;t load your earnings. Refresh the page to try again.</p>;
  }

  return (
    <div className="flex flex-col gap-6 pt-6 pb-12 text-[#00230F]">
      <header className="flex flex-wrap items-center gap-4">
        <div className="mr-auto flex flex-col gap-1">
          <h1 className="text-[28px] font-bold tracking-tight">Earnings and payouts</h1>
          <p className="text-sm text-[#5E6B63]">From your 1-on-1 sessions. You keep {data?.sharePercent ?? 80}% of every paid session.</p>
        </div>
        {currencies.length > 1 && <Segmented accent="lime" label="Currency" value={cur} options={currencies.map(c => ({ value: c, label: c }))} onChange={setCurrency} />}
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* The payout card */}
        <Card dark className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] text-[#B9C7BE]">{status.requestedAt ? 'Payout requested' : status.canRequest ? 'Ready to be paid' : 'Your balance'}</p>
              {isPending ? <div className="mt-2 h-11 w-56 animate-pulse rounded bg-white/10" /> : <p className="mt-1 text-[44px]/[1.05] font-bold tracking-tight tabular-nums">{money(status.owed, cur)}</p>}
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-bold',
                status.requestedAt ? 'bg-[#D0EA50] text-[#00230F]' : status.canRequest ? 'bg-[#305B43] text-[#E8F0E4]' : 'bg-[#1F4D33] text-[#B9C7BE]',
              )}
            >
              {status.requestedAt ? `Requested ${date(status.requestedAt)}` : status.canRequest ? 'You can request it now' : 'Not available yet'}
            </span>
          </div>

          {status.requestedAt ? (
            <p className="flex items-start gap-2 rounded-xl bg-[#0B3A20] p-3.5 text-sm text-[#E8F0E4]">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-[#D0EA50]" />
              We&apos;ll send {money(status.requestedAmount ?? status.owed, cur)} to your bank account and email you when it&apos;s on its way. Anything you earn after this is added to your next payout.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-[#B9C7BE]">
                <span>Payouts open at {money(status.minimum, cur)}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <span className="h-2.5 overflow-hidden rounded-full bg-[#1F4D33]">
                <span className="block h-full rounded-full transition-[width]" style={{ width: `${progress}%`, background: status.canRequest ? '#D0EA50' : '#9BC53D' }} />
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!status.canRequest || !hasBank || request.isPending}
              onClick={() => request.mutate()}
              className="h-12 cursor-pointer rounded-xl bg-[#D0EA50] px-6 text-sm font-bold text-[#00230F] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#1F4D33] disabled:text-[#8FA597]"
            >
              {request.isPending
                ? 'Requesting…'
                : status.requestedAt
                  ? 'Requested'
                  : status.canRequest
                    ? `Request ${money(status.owed, cur)}`
                    : `Request payout · ${money(Math.max(0, status.minimum - status.owed), cur)} to go`}
            </button>
            {status.canRequest && !hasBank && !status.requestedAt && (
              <span className="text-xs text-[#F5D97A]">
                Add your bank details first.{' '}
                <Link to="/settings" className="font-semibold underline">
                  Go to Settings
                </Link>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[#1F4D33] pt-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[#B9C7BE]">This month</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">{money(e.monthlyEarning, cur)}</p>
            </div>
            <div>
              <p className="text-xs text-[#B9C7BE]">Earned in total</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">{money(e.totalEarning, cur)}</p>
            </div>
            <div>
              <p className="text-xs text-[#B9C7BE]">Paid to you</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">{money(e.paidOut, cur)}</p>
            </div>
          </div>
        </Card>

        {/* Bank details + how it works */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardTitle
              title="Paid to"
              right={
                <Link to="/settings" className="text-[13px] font-semibold text-[#305B43] hover:text-[#00230F]">
                  {hasBank ? 'Change' : 'Add'}
                </Link>
              }
            />
            {hasBank ? (
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#E8F0E4] text-[#305B43]">
                  <Landmark className="size-5" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-semibold">{bank?.bank}</span>
                  <span className="text-[13px] text-[#5E6B63] tabular-nums">•••• {bank?.accountNo.slice(-4)}</span>
                  {(bank as { accountName?: string } | undefined)?.accountName && <span className="truncate text-xs text-[#5E6B63]">{(bank as { accountName?: string }).accountName}</span>}
                </span>
              </div>
            ) : (
              <p className="flex items-start gap-2 rounded-xl bg-[#FFF4D6] p-3 text-[13px] text-[#7A4F00]">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                Add your bank details in Settings so we can pay you.
              </p>
            )}
          </Card>
          <Card>
            <CardTitle title="How payouts work" />
            <ol className="flex flex-col gap-3 text-[13px]">
              {[
                `You keep ${data?.sharePercent ?? 80}% of every paid 1-on-1.`,
                `When you reach ${money(MINIMUM.NGN, 'NGN')} or ${money(MINIMUM.USD, 'USD')}, request a payout.`,
                'We send it to your bank account and email you.',
              ].map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#D0EA50] text-xs font-bold">{i + 1}</span>
                  <span className="pt-0.5 leading-snug">{t}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </section>


      <Card>
        <CardTitle title="Your earnings" note={`Last 12 months, in ${cur}`} />
        {isPending ? (
          <div className="h-[250px] animate-pulse rounded-xl bg-[#F3F6F2]" />
        ) : (
          <Lines
            height={220}
            label={`Your earnings per month in ${cur}`}
            labels={months.map(m => new Date(`${m.month}-01T00:00:00Z`).toLocaleDateString('en', { month: 'short', timeZone: 'UTC' }))}
            axis={n => shortMoney(n, cur)}
            series={[{ values: months.map(m => Number(m[cur] ?? 0)), color: '#305B43', fill: true }]}
          />
        )}
      </Card>

      <Card>
        <CardTitle title="Payout history" note="Money we've sent to you" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-[13px]">
            <thead>
              <tr className="text-left text-xs text-[#5E6B63]">
                <th scope="col" className="py-2 pr-2 font-medium">Date</th>
                <th scope="col" className="p-2 font-medium">Note</th>
                <th scope="col" className="p-2 font-medium">Status</th>
                <th scope="col" className="py-2 pl-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {status.requestedAt && (
                <tr className="border-t border-[#EEF2EC]">
                  <td className="py-3 pr-2 text-[#34433A]">{date(status.requestedAt)}</td>
                  <td className="p-2 text-[#5E6B63]">You asked to be paid</td>
                  <td className="p-2">
                    <span className="rounded-full bg-[#FFF4D6] px-2.5 py-0.5 text-xs font-semibold text-[#7A4F00]">On its way</span>
                  </td>
                  <td className="py-3 pl-2 text-right font-bold tabular-nums">{money(status.requestedAmount ?? status.owed, cur)}</td>
                </tr>
              )}
              {payouts.map(p => (
                <tr key={p.id} className="border-t border-[#EEF2EC]">
                  <td className="py-3 pr-2 text-[#34433A]">{date(p.paidAt)}</td>
                  <td className="p-2 text-[#5E6B63]">{p.note || 'Bank transfer'}</td>
                  <td className="p-2">
                    <span className="rounded-full bg-[#E3F2DC] px-2.5 py-0.5 text-xs font-semibold text-[#1E5B2E]">Paid</span>
                  </td>
                  <td className="py-3 pl-2 text-right font-bold tabular-nums">{money(p.amount, p.currency)}</td>
                </tr>
              ))}
              {!isPending && !payouts.length && !status.requestedAt && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#5E6B63]">
                    No payouts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Earnings;
