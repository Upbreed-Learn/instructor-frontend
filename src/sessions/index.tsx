import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { https } from '@/lib/https';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// ---------- Types ----------
type Price = { region: string; currency: string; amount: number | string; provider?: 'PAYSTACK' | 'STRIPE' };
type SessionType = { id: number; name: string; description: string | null; durationMinutes: number; isActive: boolean; allPrices: Price[] };
type Rule = { weekday: number; start: string; end: string };
type Availability = { timezone: string; rules: Rule[]; minNoticeHours: number; maxDaysAhead: number };
type Booking = {
  id: number;
  status: string;
  startsAt: string;
  endsAt: string;
  sessionType: { name: string; durationMinutes: number } | null;
  student: { name: string; email?: string } | null;
  note: string | null;
  price: { amount: number; currency: string };
  meetingUrl: string | null;
  review: { rating: number; comment: string | null } | null;
};

const CURRENCIES = ['NGN', 'GHS', 'KES', 'ZAR', 'USD', 'GBP', 'EUR', 'CAD'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const field = 'h-9 rounded-lg border border-[#D9D9D9] bg-white px-3 text-sm outline-none focus:border-[#305B43]';
const errorMessage = (e: any) => {
  const m = e?.response?.data?.message;
  return Array.isArray(m) ? m.join(', ') : m || e?.message || 'Something went wrong';
};
const money = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};
const fmt = (iso: string) => new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'short' }).format(new Date(iso));

const Sessions = () => (
  <section className="flex flex-col gap-8 pt-6 pb-10">
    <div>
      <h1 className="text-2xl font-bold">1-on-1 Sessions</h1>
      <p className="text-sm text-[#737373]">
        Students request a time from your weekly hours. Accept within 48 hours; once they pay, you both get the video link by email.
      </p>
    </div>
    <Tabs defaultValue="bookings" className="flex flex-col gap-6">
      <TabsList className="self-start">
        <TabsTrigger value="bookings">Requests & bookings</TabsTrigger>
        <TabsTrigger value="types">My sessions & prices</TabsTrigger>
        <TabsTrigger value="hours">Weekly hours</TabsTrigger>
      </TabsList>
      <TabsContent value="bookings">
        <Bookings />
      </TabsContent>
      <TabsContent value="types">
        <SessionTypes />
      </TabsContent>
      <TabsContent value="hours">
        <WeeklyHours />
      </TabsContent>
    </Tabs>
  </section>
);

// ---------- Requests & bookings ----------
function Bookings() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'upcoming' | 'REQUESTED' | 'COMPLETED' | 'all'>('upcoming');
  const params = filter === 'upcoming' ? { upcoming: 'true' } : filter === 'all' ? {} : { status: filter };
  const q = useQuery({
    queryKey: ['my-session-bookings', filter],
    queryFn: () => https.get('/sessions/me/bookings', { params: { limit: 50, ...params } }).then(r => r.data as { data: Booking[]; stats: { requested: number; upcoming: number; completed: number } }),
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ['my-session-bookings'] });
  const act = useMutation({
    mutationFn: (a: { id: number; action: 'accept' | 'decline'; reason?: string }) =>
      https.post(`/sessions/bookings/${a.id}/${a.action}`, a.action === 'decline' ? { reason: a.reason } : undefined),
    onSuccess: (_, a) => {
      toast.success(a.action === 'accept' ? 'Accepted — the student has 24 hours to pay' : 'Request declined');
      refresh();
    },
    onError: e => toast.error('Could not update the request', { description: errorMessage(e) }),
  });
  const link = useMutation({
    mutationFn: (a: { id: number; meetingUrl: string }) => https.patch(`/sessions/bookings/${a.id}/meeting-link`, { meetingUrl: a.meetingUrl }),
    onSuccess: () => {
      toast.success('Meeting link saved');
      refresh();
    },
    onError: e => toast.error('Could not save the link', { description: errorMessage(e) }),
  });
  const stats = q.data?.stats;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        {[
          ['Waiting for you', stats?.requested],
          ['Upcoming', stats?.upcoming],
          ['Completed', stats?.completed],
        ].map(([label, n]) => (
          <div key={label as string} className="rounded-xl bg-[#305B43] px-6 py-4 text-white">
            <p className="text-3xl font-bold">{n ?? '–'}</p>
            <p className="text-xs text-[#D0EA50]">{label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {(
          [
            ['upcoming', 'Upcoming & open'],
            ['REQUESTED', 'Waiting for you'],
            ['COMPLETED', 'Completed'],
            ['all', 'All'],
          ] as const
        ).map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ${filter === v ? 'bg-[#305B43] text-white' : 'bg-[#F4F4F4] text-[#737373]'}`}>
            {l}
          </button>
        ))}
      </div>
      {q.isPending ? (
        <Skeleton className="h-32 w-full" />
      ) : q.isError ? (
        <p className="text-sm text-red-600">Could not load your sessions.</p>
      ) : !q.data.data.length ? (
        <p className="text-sm text-[#737373]">Nothing here yet. Add a session and your weekly hours so students can book you.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {q.data.data.map(b => (
            <li key={b.id} className="flex flex-col gap-2 rounded-xl border border-[#D9D9D9] p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">
                  {b.sessionType?.name} · {b.student?.name}
                </p>
                <span className="rounded bg-[#F4F4F4] px-2 py-0.5 text-xs">{b.status === 'ACCEPTED' ? 'Waiting for payment' : b.status.charAt(0) + b.status.slice(1).toLowerCase()}</span>
              </div>
              <p className="text-[#737373]">
                {fmt(b.startsAt)} · {b.sessionType?.durationMinutes} min · {money(b.price.amount, b.price.currency)}
              </p>
              {b.note && <p className="italic text-[#737373]">“{b.note}”</p>}
              {b.student?.email && <p className="text-xs text-[#737373]">Student email: {b.student.email}</p>}
              {b.status === 'REQUESTED' && (
                <div className="flex gap-2">
                  <Button disabled={act.isPending} onClick={() => act.mutate({ id: b.id, action: 'accept' })}>
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    disabled={act.isPending}
                    onClick={() => {
                      const reason = window.prompt('Reason for declining (optional, shared with the student):') ?? undefined;
                      act.mutate({ id: b.id, action: 'decline', reason });
                    }}
                  >
                    Decline
                  </Button>
                </div>
              )}
              {b.status === 'CONFIRMED' &&
                (b.meetingUrl ? (
                  <a href={b.meetingUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#305B43] underline">
                    Join video call
                  </a>
                ) : (
                  <form
                    className="flex gap-2"
                    onSubmit={e => {
                      e.preventDefault();
                      const url = new FormData(e.currentTarget).get('url') as string;
                      link.mutate({ id: b.id, meetingUrl: url });
                    }}
                  >
                    <input name="url" required placeholder="Paste your Zoom / Meet link (https://…)" className={`${field} flex-1`} />
                    <Button type="submit" disabled={link.isPending}>
                      Save link
                    </Button>
                  </form>
                ))}
              {b.review && (
                <p className="text-xs">
                  {'★'.repeat(b.review.rating)} {b.review.comment && <span className="text-[#737373]">“{b.review.comment}”</span>}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------- Session types & prices ----------
const emptyType = (): Omit<SessionType, 'id' | 'isActive'> & { id?: number; isActive?: boolean } => ({
  name: '',
  description: '',
  durationMinutes: 60,
  allPrices: [
    { region: 'DEFAULT', currency: 'USD', amount: '' },
    { region: 'NG', currency: 'NGN', amount: '' },
  ],
});

function SessionTypes() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['my-session-types'], queryFn: () => https.get('/sessions/me/types').then(r => r.data.data as SessionType[]) });
  const [editing, setEditing] = useState<ReturnType<typeof emptyType> | null>(null);
  const save = useMutation({
    mutationFn: (t: ReturnType<typeof emptyType>) => {
      const body = {
        name: t.name,
        description: t.description || null,
        durationMinutes: Number(t.durationMinutes),
        prices: t.allPrices.filter(p => p.region && p.amount !== '').map(p => ({ region: p.region.toUpperCase(), currency: p.currency, amount: Number(p.amount) })),
        ...(t.isActive !== undefined ? { isActive: t.isActive } : {}),
      };
      return t.id ? https.patch(`/sessions/me/types/${t.id}`, body) : https.post('/sessions/me/types', body);
    },
    onSuccess: () => {
      toast.success('Session saved');
      setEditing(null);
      qc.invalidateQueries({ queryKey: ['my-session-types'] });
    },
    onError: e => toast.error('Could not save', { description: errorMessage(e) }),
  });
  const remove = useMutation({
    mutationFn: (id: number) => https.delete(`/sessions/me/types/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-session-types'] }),
  });

  return (
    <div className="flex flex-col gap-4">
      {q.isPending ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        q.data?.map(t => (
          <div key={t.id} className="flex items-center justify-between rounded-xl border border-[#D9D9D9] p-4 text-sm">
            <div>
              <p className="font-semibold">
                {t.name} {!t.isActive && <span className="ml-1 rounded bg-[#EDEDED] px-1.5 text-xs font-normal">Hidden</span>}
              </p>
              <p className="text-[#737373]">
                {t.durationMinutes} min · {t.allPrices.map(p => `${p.region === 'DEFAULT' ? 'Everyone else' : p.region}: ${money(Number(p.amount), p.currency)}`).join(' · ')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="cursor-pointer font-semibold text-[#305B43]" onClick={() => setEditing({ ...t })}>
                Edit
              </button>
              <button
                className="cursor-pointer"
                aria-label="Delete session"
                onClick={() => window.confirm(`Delete "${t.name}"? Existing bookings are kept.`) && remove.mutate(t.id)}
              >
                <Trash className="size-4 text-red-600" />
              </button>
            </div>
          </div>
        ))
      )}
      {editing ? (
        <form
          className="flex flex-col gap-4 rounded-xl bg-[#F4F4F4] p-5 text-sm"
          onSubmit={e => {
            e.preventDefault();
            save.mutate(editing);
          }}
        >
          <div className="grid grid-cols-3 gap-3">
            <label className="col-span-2 flex flex-col gap-1 text-xs text-[#737373]">
              Session name
              <input required className={field} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Portfolio review" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-[#737373]">
              Length
              <select className={field} value={editing.durationMinutes} onChange={e => setEditing({ ...editing, durationMinutes: Number(e.target.value) })}>
                {[15, 30, 45, 60, 90, 120].map(m => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs text-[#737373]">
            What students get (optional)
            <textarea className={`${field} h-20 py-2`} value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
          </label>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-[#737373]">Prices. Students see their own country's price; everyone else sees the DEFAULT price.</p>
            {editing.allPrices.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={`${field} w-28 uppercase`}
                  value={p.region}
                  disabled={i === 0}
                  placeholder="GH"
                  maxLength={7}
                  onChange={e => setEditing({ ...editing, allPrices: editing.allPrices.map((x, j) => (j === i ? { ...x, region: e.target.value.toUpperCase() } : x)) })}
                />
                <select className={field} value={p.currency} onChange={e => setEditing({ ...editing, allPrices: editing.allPrices.map((x, j) => (j === i ? { ...x, currency: e.target.value } : x)) })}>
                  {CURRENCIES.map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={`${field} w-32`}
                  value={p.amount}
                  required={i === 0}
                  onChange={e => setEditing({ ...editing, allPrices: editing.allPrices.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)) })}
                />
                {i > 0 && (
                  <button type="button" className="cursor-pointer" onClick={() => setEditing({ ...editing, allPrices: editing.allPrices.filter((_, j) => j !== i) })}>
                    <Trash className="size-4 text-[#737373]" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 self-start text-xs font-semibold"
              onClick={() => setEditing({ ...editing, allPrices: [...editing.allPrices, { region: '', currency: 'USD', amount: '' }] })}
            >
              <Plus className="size-3" /> Add a country price
            </button>
          </div>
          {editing.id && (
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={editing.isActive ?? true} onChange={e => setEditing({ ...editing, isActive: e.target.checked })} /> Show to students
            </label>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? 'Saving…' : 'Save session'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button className="self-start" onClick={() => setEditing(emptyType())}>
          <Plus /> Add a session
        </Button>
      )}
    </div>
  );
}

// ---------- Weekly hours ----------
function WeeklyHours() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['my-availability'], queryFn: () => https.get('/sessions/me/availability').then(r => r.data.data as Availability) });
  const [form, setForm] = useState<Availability | null>(null);
  useEffect(() => {
    if (q.data) setForm({ ...q.data, timezone: q.data.rules.length ? q.data.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone || q.data.timezone });
  }, [q.data]);
  const save = useMutation({
    mutationFn: (a: Availability) => https.put('/sessions/me/availability', a),
    onSuccess: () => {
      toast.success('Weekly hours saved');
      qc.invalidateQueries({ queryKey: ['my-availability'] });
    },
    onError: e => toast.error('Could not save', { description: errorMessage(e) }),
  });
  if (!form) return <Skeleton className="h-48 w-full" />;
  const setRules = (rules: Rule[]) => setForm({ ...form, rules });

  return (
    <form
      className="flex max-w-2xl flex-col gap-5 text-sm"
      onSubmit={e => {
        e.preventDefault();
        save.mutate(form);
      }}
    >
      <label className="flex flex-col gap-1 text-xs text-[#737373]">
        Your time zone
        <input className={field} value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })} placeholder="Africa/Lagos" />
      </label>
      <div className="flex flex-col gap-2">
        {DAYS.map((day, weekday) => {
          const rules = form.rules.filter(r => r.weekday === weekday);
          return (
            <div key={day} className="flex items-start gap-4 border-b border-[#EDEDED] pb-2">
              <p className="w-24 pt-2 font-semibold">{day}</p>
              <div className="flex flex-1 flex-col gap-2">
                {!rules.length && <p className="pt-2 text-[#9B9B9B]">Unavailable</p>}
                {rules.map(r => {
                  const idx = form.rules.indexOf(r);
                  const update = (patch: Partial<Rule>) => setRules(form.rules.map((x, j) => (j === idx ? { ...x, ...patch } : x)));
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="time" className={field} value={r.start} onChange={e => update({ start: e.target.value })} />
                      <span>to</span>
                      <input type="time" className={field} value={r.end} onChange={e => update({ end: e.target.value })} />
                      <button type="button" className="cursor-pointer" onClick={() => setRules(form.rules.filter((_, j) => j !== idx))}>
                        <Trash className="size-4 text-[#737373]" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button type="button" className="cursor-pointer pt-2 text-xs font-semibold text-[#305B43]" onClick={() => setRules([...form.rules, { weekday, start: '09:00', end: '17:00' }])}>
                + Add hours
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4">
        <label className="flex flex-col gap-1 text-xs text-[#737373]">
          Minimum notice (hours)
          <input type="number" min={0} max={336} className={`${field} w-32`} value={form.minNoticeHours} onChange={e => setForm({ ...form, minNoticeHours: Number(e.target.value) })} />
        </label>
        <label className="flex flex-col gap-1 text-xs text-[#737373]">
          Book up to (days ahead)
          <input type="number" min={1} max={180} className={`${field} w-32`} value={form.maxDaysAhead} onChange={e => setForm({ ...form, maxDaysAhead: Number(e.target.value) })} />
        </label>
      </div>
      <Button type="submit" className="self-start" disabled={save.isPending}>
        {save.isPending ? 'Saving…' : 'Save weekly hours'}
      </Button>
    </form>
  );
}

export default Sessions;
