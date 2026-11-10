import { Card, CardTitle, Delta, Lines, Segmented, bucketLabel, money, num } from '@/components/dash';
import type { UserDetailsType } from '@/lib/constants';
import { useEarnings } from '@/lib/earnings';
import { https } from '@/lib/https';
import { cn } from '@/lib/utils';
import { useGetUserDetails } from '@/queries/hooks';
import { useUserIdStore } from '@/store/user-id-control';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

type Period = '7d' | '30d' | '12m';
type Overview = {
  period: Period;
  kpis: {
    viewers: { value: number; change: number | null };
    watchTime: { hours: number; minutesPerViewer: number; change: number | null };
    finishRate: { value: number | null };
    rating: { value: number | null; count: number };
  };
  viewers: { at: string; viewers: number }[];
  bestDay: { at: string; viewers: number } | null;
  classes: {
    id: number;
    title: string;
    viewers: number;
    watchHours: number;
    rating: number | null;
    reviews: number;
    lessons: number;
    lengthSeconds: number;
    mostStopAtLesson: number | null;
    reached: number[];
    isActive: boolean;
  }[];
  reviews: { rating: number; comment: string; at: string; course: string; name: string }[];
  sessionRequests: { id: number; startsAt: string; endsAt: string; amount: number; currency: string; student: string; answerBy: string }[];
  upcomingSessions: { id: number; startsAt: string; endsAt: string; meetingUrl: string | null; student: string; typeName: string | null }[];
};

const PERIODS: { value: Period; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '12m', label: '12 months' },
];
const MINIMUM: Record<string, number> = { NGN: 100_000, USD: 100 };

const clock = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
const hoursLeft = (iso: string) => Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 3_600_000));

const Overview = () => {
  const [period, setPeriod] = useState<Period>('30d');
  const { userId } = useUserIdStore();
  const me: UserDetailsType | undefined = useGetUserDetails(userId!!).data?.data?.data;
  const queryClient = useQueryClient();
  const q = useQuery({
    queryKey: ['instructor-overview', period],
    queryFn: () => https.get('/instructor/me/overview', { params: { period } }).then(r => r.data as Overview),
    placeholderData: prev => prev,
  });
  const earnings = useEarnings();
  const d = q.data;
  const k = d?.kpis;
  const loading = q.isPending;

  // The currency they are owed most in (NGN when nothing yet).
  const e = earnings.data;
  const cur = (e?.currencies ?? []).sort((a, b) => (e?.byCurrency[b]?.pendingPayout ?? 0) - (e?.byCurrency[a]?.pendingPayout ?? 0))[0] ?? 'NGN';
  const bal = e?.byCurrency[cur] ?? { totalEarning: 0, monthlyEarning: 0, paidOut: 0, pendingPayout: 0 };
  const status = e?.payoutStatus?.[cur] ?? { minimum: MINIMUM[cur] ?? 100, owed: bal.pendingPayout, canRequest: false, requestedAt: null, requestedAmount: null };
  const progress = Math.min(100, Math.round((status.owed / status.minimum) * 100));

  const request = useMutation({
    mutationFn: () => https.post('/instructor/me/payout-request', { currency: cur }).then(r => r.data.message as string),
    onSuccess: message => {
      toast.success('Payout requested', { description: message });
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
    },
    onError: (err: { response?: { data?: { message?: string } }; message?: string }) => toast.error('Could not request a payout', { description: err?.response?.data?.message || err?.message }),
  });
  const answer = useMutation({
    mutationFn: (a: { id: number; action: 'accept' | 'decline'; reason?: string }) => https.post(`/sessions/bookings/${a.id}/${a.action}`, a.action === 'decline' ? { reason: a.reason } : undefined),
    onSuccess: (_, a) => {
      toast.success(a.action === 'accept' ? 'Accepted. The student has 24 hours to pay.' : 'Request declined');
      queryClient.invalidateQueries({ queryKey: ['instructor-overview'] });
    },
    onError: (err: { response?: { data?: { message?: string } }; message?: string }) => toast.error('Could not update the request', { description: err?.response?.data?.message || err?.message }),
  });

  const name = me ? `${me.fname} ${me.lname}`.trim() : '';
  const photo = me?.instructorProfile?.profilePictureUrl;
  const kpi = (label: string, value: string, note: React.ReactNode) => (
    <article className="flex min-w-0 flex-col gap-1.5 rounded-[18px] border border-[#E3EAE1] bg-white p-[18px]">
      <p className="text-[13px] font-medium text-[#5E6B63]">{label}</p>
      {loading ? <div className="h-9 w-2/3 animate-pulse rounded bg-[#EEF2EC]" /> : <p className="text-[30px]/[1.1] font-bold tracking-tight tabular-nums">{value}</p>}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5E6B63]">{loading ? ' ' : note}</div>
    </article>
  );

  return (
    <div className="flex flex-col gap-6 pt-8 pb-12 text-[#00230F]">
      <header className="flex flex-wrap items-center gap-4">
        <div className="mr-auto flex items-center gap-3.5">
          {photo ? (
            <img src={photo} alt="" className="size-14 rounded-2xl object-cover" />
          ) : (
            <span className="grid size-14 place-items-center rounded-2xl bg-[#00230F] text-xl font-bold text-[#D0EA50]">{initials(name || 'U')}</span>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-bold tracking-tight">Hello{me?.fname ? `, ${me.fname}` : ''}</h1>
            <p className="text-sm text-[#5E6B63]">Your classes, your learners and your money.</p>
          </div>
        </div>
        <Segmented label="Period" value={period} options={PERIODS} onChange={setPeriod} />
        {userId && (
          <a
            href={`${import.meta.env.VITE_WEBSITE_URL ?? 'https://beta.upbreedlearn.com'}/sessions/${userId}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-[#D0EA50] px-4 py-3 text-[13px] font-bold text-[#00230F] hover:brightness-95"
          >
            View my public profile
          </a>
        )}
      </header>

      {/* Key numbers */}
      <section aria-label="Key numbers" className={cn('grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4', q.isFetching && !loading && 'opacity-70')}>
        {kpi('Viewers', num(k?.viewers.value ?? 0), <><Delta change={k?.viewers.change} /> people, counted once each</>)}
        {kpi('Watch time', `${num(k?.watchTime.hours ?? 0)} h`, <><Delta change={k?.watchTime.change} /> about {k?.watchTime.minutesPerViewer ?? 0} min each</>)}
        {kpi('Finish rate', k?.finishRate.value == null ? '—' : `${k.finishRate.value}%`, 'of started lessons watched to the end')}
        {kpi('Rating', k?.rating.value == null ? '—' : k.rating.value.toFixed(1), k?.rating.count ? `from ${num(k.rating.count)} rating${k.rating.count === 1 ? '' : 's'}` : 'No ratings yet')}
      </section>

      {/* Viewers + money */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle
            title="Learners watching your classes"
            note="Each person counts once a day, however many lessons they watch"
            right={
              d?.bestDay ? (
                <p className="text-[13px] text-[#34433A]">
                  Best day:{' '}
                  <b>
                    {new Date(d.bestDay.at).toLocaleDateString('en', period === '12m' ? { month: 'long', timeZone: 'UTC' } : { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })} · {d.bestDay.viewers}
                  </b>
                </p>
              ) : null
            }
          />
          {loading ? (
            <div className="h-[260px] animate-pulse rounded-xl bg-[#F3F6F2]" />
          ) : (
            <Lines
              height={220}
              label={`Viewers per ${period === '12m' ? 'month' : 'day'}`}
              labels={(d?.viewers ?? []).map(v => bucketLabel(v.at, period))}
              axis={n => num(n)}
              series={[{ values: (d?.viewers ?? []).map(v => v.viewers), color: '#305B43', fill: true }]}
            />
          )}
        </Card>

        <Card dark>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[#D0EA50]">Your money</h2>
            <span className="text-xs text-[#B9C7BE]">You keep {e?.sharePercent ?? 80}%</span>
          </div>
          <div>
            <p className="text-[13px] text-[#B9C7BE]">{status.requestedAt ? 'Payout requested' : 'Ready to be paid'}</p>
            <p className="mt-0.5 text-4xl font-bold tabular-nums">{money(status.owed, cur)}</p>
          </div>
          {!status.requestedAt && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-[#B9C7BE]">
                <span>Payouts open at {money(status.minimum, cur)}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <span className="h-2 overflow-hidden rounded-full bg-[#1F4D33]">
                <span className="block h-full rounded-full" style={{ width: `${progress}%`, background: status.canRequest ? '#D0EA50' : '#9BC53D' }} />
              </span>
            </div>
          )}
          <button
            type="button"
            disabled={!status.canRequest || request.isPending}
            onClick={() => request.mutate()}
            className="cursor-pointer rounded-xl bg-[#D0EA50] p-3.5 text-sm font-bold text-[#00230F] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#1F4D33] disabled:text-[#8FA597]"
          >
            {request.isPending
              ? 'Requesting…'
              : status.requestedAt
                ? `Requested on ${new Date(status.requestedAt).toLocaleDateString('en', { day: 'numeric', month: 'short' })}`
                : status.canRequest
                  ? `Request payout · ${money(status.owed, cur)}`
                  : `Request payout · ${money(Math.max(0, status.minimum - status.owed), cur)} to go`}
          </button>
          <div className="grid grid-cols-2 gap-3 border-t border-[#1F4D33] pt-3.5">
            <div>
              <p className="text-xs text-[#B9C7BE]">This month</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">{money(bal.monthlyEarning, cur)}</p>
            </div>
            <div>
              <p className="text-xs text-[#B9C7BE]">Paid to you so far</p>
              <p className="mt-0.5 text-lg font-bold tabular-nums">{money(bal.paidOut, cur)}</p>
            </div>
          </div>
          <Link to="/earnings" className="text-xs font-semibold text-[#D0EA50] underline">
            See all earnings
          </Link>
        </Card>
      </section>

      {/* Sessions */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle
            title="Waiting for your answer"
            right={
              d?.sessionRequests.length ? (
                <span className="rounded-full bg-[#FFF4D6] px-2.5 py-0.5 text-xs font-bold text-[#7A4F00]">
                  {d.sessionRequests.length} request{d.sessionRequests.length === 1 ? '' : 's'}
                </span>
              ) : null
            }
          />
          {d?.sessionRequests.length ? (
            d.sessionRequests.map(r => (
              <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-[14px] border border-[#E3EAE1] p-3.5">
                <span className="grid size-10 place-items-center rounded-full bg-[#E8F0E4] text-[13px] font-bold text-[#305B43]">{initials(r.student)}</span>
                <span className="flex min-w-[150px] flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold">{r.student}</span>
                  <span className="text-xs text-[#5E6B63]">
                    {new Date(r.startsAt).toLocaleString('en', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {money(r.amount, r.currency)}
                  </span>
                  <span className="text-xs text-[#A3262A]">Answer within {hoursLeft(r.answerBy)} hours</span>
                </span>
                <span className="flex gap-2">
                  <button
                    type="button"
                    disabled={answer.isPending}
                    onClick={() => {
                      const reason = window.prompt('Reason for declining (optional, shared with the student):');
                      if (reason !== null) answer.mutate({ id: r.id, action: 'decline', reason: reason || undefined });
                    }}
                    className="cursor-pointer rounded-[10px] border border-[#DDE5DB] bg-white px-3 py-2.5 text-[13px] font-semibold disabled:opacity-50"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    disabled={answer.isPending}
                    onClick={() => answer.mutate({ id: r.id, action: 'accept' })}
                    className="cursor-pointer rounded-[10px] bg-[#305B43] px-3.5 py-2.5 text-[13px] font-bold text-white hover:bg-[#00230F] disabled:opacity-50"
                  >
                    Accept
                  </button>
                </span>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-[#5E6B63]">{loading ? 'Loading…' : 'No requests right now.'}</p>
          )}
        </Card>

        <Card>
          <CardTitle
            title="Coming up"
            right={
              <Link to="/sessions" className="text-[13px] font-semibold text-[#305B43] hover:text-[#00230F]">
                Calendar and days off
              </Link>
            }
          />
          {d?.upcomingSessions.length ? (
            d.upcomingSessions.map(u => {
              const start = new Date(u.startsAt);
              return (
                <div key={u.id} className="flex items-center gap-3.5 border-t border-[#EEF2EC] py-2.5 first:border-t-0">
                  <span className="w-13 shrink-0 rounded-xl bg-[#E8F0E4] py-1.5 text-center">
                    <span className="block text-[11px] font-semibold text-[#305B43] uppercase">{start.toLocaleDateString('en', { month: 'short' })}</span>
                    <span className="block text-xl font-bold">{start.getDate()}</span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-semibold">{u.student}</span>
                    <span className="text-xs text-[#5E6B63]">
                      {start.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}–{new Date(u.endsAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                      {u.typeName ? ` · ${u.typeName}` : ''}
                    </span>
                  </span>
                  {u.meetingUrl ? (
                    <a href={u.meetingUrl} target="_blank" rel="noreferrer" className="rounded-[10px] bg-[#D0EA50] px-3 py-2 text-xs font-bold text-[#00230F]">
                      Join
                    </a>
                  ) : (
                    <Link to="/sessions" className="rounded-[10px] border border-[#DDE5DB] px-3 py-2 text-xs font-semibold">
                      Add link
                    </Link>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-[13px] text-[#5E6B63]">{loading ? 'Loading…' : 'No sessions booked yet.'}</p>
          )}
        </Card>
      </section>

      {/* Classes + reviews */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle
            title="How your classes are doing"
            right={
              <Link to="/courses" className="text-[13px] font-semibold text-[#305B43] hover:text-[#00230F]">
                My courses
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-[13px]">
              <thead>
                <tr className="text-left text-xs text-[#5E6B63]">
                  <th scope="col" className="py-2 pr-2 font-medium">Class</th>
                  <th scope="col" className="p-2 font-medium">Viewers</th>
                  <th scope="col" className="p-2 font-medium">Watch time</th>
                  <th scope="col" className="w-44 p-2 font-medium">How far people get</th>
                  <th scope="col" className="py-2 pl-2 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {(d?.classes ?? []).map(c => (
                  <tr key={c.id} className="border-t border-[#EEF2EC]">
                    <td className="py-3 pr-2">
                      <span className="flex flex-col gap-0.5">
                        <span className="font-semibold">{c.title}</span>
                        <span className="text-xs text-[#5E6B63]">
                          {c.lessons} lesson{c.lessons === 1 ? '' : 's'} · {clock(c.lengthSeconds)}
                          {!c.isActive && ' · Not live yet'}
                        </span>
                      </span>
                    </td>
                    <td className="p-2 font-semibold tabular-nums">{num(c.viewers)}</td>
                    <td className="p-2 tabular-nums">{num(c.watchHours)} h</td>
                    <td className="p-2">
                      {c.viewers ? (
                        <span className="flex flex-col gap-1">
                          <span className="flex h-1.5 gap-0.5" title={c.reached.map((r, i) => `${(i + 1) * 20}% of the way: ${r}% of viewers`).join('\n')}>
                            {c.reached.map((r, i) => (
                              <span key={i} className="flex-1 rounded-[2px]" style={{ background: r >= 50 ? '#34A853' : r > 0 ? '#9BC53D' : '#E3EAE1' }} />
                            ))}
                          </span>
                          <span className="text-[11px] text-[#5E6B63]">{c.mostStopAtLesson ? `Most stop after lesson ${c.mostStopAtLesson}` : 'Most watch to the end'}</span>
                        </span>
                      ) : (
                        <span className="text-[#5E6B63]">No viewers yet</span>
                      )}
                    </td>
                    <td className="py-3 pl-2 tabular-nums">
                      {c.rating ? (
                        <>
                          ★ {c.rating.toFixed(1)} <span className="text-[#5E6B63]">({c.reviews})</span>
                        </>
                      ) : (
                        <span className="text-[#5E6B63]">No ratings</span>
                      )}
                    </td>
                  </tr>
                ))}
                {!loading && !d?.classes.length && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-[#5E6B63]">
                      You have no classes yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardTitle title="What learners say" />
          {d?.reviews.length ? (
            d.reviews.map((r, i) => (
              <figure key={i} className="flex flex-col gap-1.5 border-t border-[#EEF2EC] py-3 first:border-t-0">
                <span className="text-[13px] tracking-[2px] text-[#C98A00]" aria-label={`Rated ${r.rating} out of 5`}>
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </span>
                {r.comment && <blockquote className="text-[13px] leading-snug">{r.comment}</blockquote>}
                <figcaption className="text-xs text-[#5E6B63]">
                  {r.name} · {r.course}
                </figcaption>
              </figure>
            ))
          ) : (
            <p className="text-[13px] text-[#5E6B63]">{loading ? 'Loading…' : 'No ratings yet. They appear here as learners rate your classes.'}</p>
          )}
        </Card>
      </section>
    </div>
  );
};

export default Overview;
