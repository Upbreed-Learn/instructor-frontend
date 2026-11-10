import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/** Shared pieces for the dashboard and finance pages (the approved Nov 2026 design). */

const SYMBOL: Record<string, string> = { NGN: '₦', USD: '$', GHS: 'GH₵', KES: 'KSh', ZAR: 'R', GBP: '£', EUR: '€' };
export const symbol = (c: string) => SYMBOL[c] ?? `${c} `;

/** ₦2,480,500 — always the full amount with commas. */
export const money = (n: number, c: string) => `${symbol(c)}${Math.round(n).toLocaleString('en')}`;
/** ₦2.5m / ₦480k for chart axes. */
export const shortMoney = (n: number, c: string) => {
  const a = Math.abs(n);
  const v = a >= 1e6 ? `${+(n / 1e6).toFixed(1)}m` : a >= 1e3 ? `${+(n / 1e3).toFixed(0)}k` : `${Math.round(n)}`;
  return `${symbol(c)}${v}`;
};
export const num = (n: number) => Math.round(n).toLocaleString('en');

/** A chart top that splits into three tidy steps (e.g. 3m → 2m, 1m, 0). */
export const niceTop = (v: number) => niceMax(Math.max(v, 1e-9) / 3) * 3;

/** Rounds a chart's top up to a tidy number (1, 2, 2.5, 5 × 10ⁿ). */
export function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const f = v / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
}

export function Segmented<T extends string>(props: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; dark?: boolean; accent?: 'lime' | 'ink' }) {
  const { label, value, options, onChange, dark, accent = 'ink' } = props;
  return (
    <div role="group" aria-label={label} className={cn('flex gap-0.5 rounded-xl p-1', dark ? 'bg-[#00230F]' : 'border border-[#DDE5DB] bg-white')}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={cn(
              'cursor-pointer rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors',
              on
                ? accent === 'lime' || dark
                  ? 'bg-[#D0EA50] text-[#00230F]'
                  : 'bg-[#00230F] text-[#D0EA50]'
                : dark
                  ? 'text-[#E8F0E4] hover:bg-white/10'
                  : 'text-[#5E6B63] hover:bg-[#F0F4EE]',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** A small trend line. */
export function Spark({ values, color, className }: { values: number[]; color: string; className?: string }) {
  if (values.length < 2) return <div className={cn('h-9', className)} />;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const d = values
    .map((v, i) => `${i ? 'L' : 'M'}${((i * 160) / (values.length - 1)).toFixed(1)} ${(32 - ((v - min) / Math.max(1e-9, max - min)) * 28).toFixed(1)}`)
    .join(' ');
  return (
    <svg aria-hidden="true" viewBox="0 0 160 36" preserveAspectRatio="none" className={cn('h-9 w-full', className)}>
      <path d={max === min ? 'M0 20 L160 20' : d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** "+18%" / "−4%" / "New" chip. `change` null means there was nothing before to compare with. */
export function Delta({ change, hero, suffix = '%' }: { change: number | null | undefined; hero?: boolean; suffix?: string }) {
  if (change === undefined) return null;
  const label = change === null ? 'New' : `${change > 0 ? '+' : change < 0 ? '−' : ''}${Math.abs(change)}${suffix}`;
  const down = (change ?? 0) < 0;
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-bold tabular-nums',
        down ? 'bg-[#FCE8E8] text-[#A3262A]' : hero ? 'bg-[#D0EA50] text-[#00230F]' : 'bg-[#E3F2DC] text-[#00230F]',
      )}
    >
      {label}
    </span>
  );
}

export function Card({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <section className={cn('flex min-w-0 flex-col gap-4 rounded-[18px] p-6', dark ? 'bg-[#00230F] text-white' : 'border border-[#E3EAE1] bg-white', className)}>
      {children}
    </section>
  );
}

export function CardTitle({ title, note, right, dark }: { title: string; note?: string; right?: ReactNode; dark?: boolean }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className={cn('text-lg font-semibold', dark && 'text-[#D0EA50]')}>{title}</h2>
        {note && <p className={cn('mt-1 text-[13px]', dark ? 'text-[#B9C7BE]' : 'text-[#5E6B63]')}>{note}</p>}
      </div>
      {right}
    </div>
  );
}

export function Kpi(props: { label: string; value: string; change?: number | null; changeSuffix?: string; note: string; spark?: number[]; hero?: boolean; loading?: boolean }) {
  const { label, value, change, changeSuffix, note, spark, hero, loading } = props;
  const down = (change ?? 0) < 0;
  return (
    <article className={cn('flex min-w-0 flex-col gap-2 rounded-[18px] border p-[18px]', hero ? 'border-[#00230F] bg-[#00230F] text-white' : 'border-[#E3EAE1] bg-white text-[#00230F]')}>
      <div className="flex items-center justify-between gap-2">
        <p className={cn('text-[13px] font-medium', hero ? 'text-[#D0EA50]' : 'text-[#5E6B63]')}>{label}</p>
        {!loading && <Delta change={change} hero={hero} suffix={changeSuffix} />}
      </div>
      {loading ? (
        <div className={cn('h-9 w-2/3 animate-pulse rounded', hero ? 'bg-white/10' : 'bg-[#EEF2EC]')} />
      ) : (
        <p className="truncate text-[30px]/[1.1] font-bold tracking-tight tabular-nums">{value}</p>
      )}
      {spark && <Spark values={spark} color={hero ? '#D0EA50' : down ? '#E5484D' : '#34A853'} />}
      <p className={cn('text-xs', hero ? 'text-[#B9C7BE]' : 'text-[#5E6B63]')}>{loading ? ' ' : note}</p>
    </article>
  );
}

/** Stacked bars (one per bucket), with an axis in the chosen currency. */
export function StackedBars(props: {
  rows: { label: string; parts: { value: number; color: string; name: string }[] }[];
  currency: string;
  highlightLast?: boolean;
}) {
  const { rows, currency, highlightLast } = props;
  const top = niceTop(Math.max(0, ...rows.map(r => r.parts.reduce((n, p) => n + p.value, 0))));
  const ticks = [top, (top * 2) / 3, top / 3, 0];
  return (
    <div className="flex gap-3">
      <div className="flex flex-col justify-between pb-6 text-right text-[11px] text-[#5E6B63] tabular-nums">
        {ticks.map(t => (
          <span key={t}>{shortMoney(t, currency)}</span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div
          className="grid h-[230px] items-end gap-[clamp(2px,0.8vw,10px)] border-b border-[#E3EAE1]"
          style={{
            gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))`,
            backgroundImage: 'linear-gradient(#EEF2EC 1px, transparent 1px)',
            backgroundSize: '100% 33.33%',
          }}
        >
          {rows.map((r, i) => {
            const total = r.parts.reduce((n, p) => n + p.value, 0);
            return (
              <div
                key={i}
                title={`${r.label}: ${money(total, currency)}\n${r.parts.map(p => `${p.name} ${money(p.value, currency)}`).join('\n')}`}
                className="flex h-full flex-col justify-end gap-px"
              >
                {[...r.parts].reverse().map((p, j) => (
                  <span
                    key={j}
                    className="block first:rounded-t-[4px]"
                    style={{ height: `${(p.value / top) * 100}%`, background: highlightLast && i === rows.length - 1 && j === r.parts.length - 1 ? '#00230F' : p.color }}
                  />
                ))}
              </div>
            );
          })}
        </div>
        <AxisLabels labels={rows.map(r => r.label)} />
      </div>
    </div>
  );
}

/** Line chart (with optional filled area under the first line). */
export function Lines(props: { series: { values: number[]; color: string; fill?: boolean }[]; labels: string[]; axis: (n: number) => string; height?: number; label: string }) {
  const { series, labels, axis, height = 240, label } = props;
  const top = niceTop(Math.max(0, ...series.flatMap(s => s.values)));
  const n = Math.max(1, (series[0]?.values.length ?? 1) - 1);
  const pts = (vals: number[]) => vals.map((v, i) => [(i * 720) / n, height - (v / top) * (height - 4)] as const);
  const path = (p: readonly (readonly [number, number])[]) => p.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
  return (
    <div className="flex gap-3">
      <div className="flex flex-col justify-between pb-6 text-right text-[11px] text-[#5E6B63] tabular-nums">
        {[top, (top * 2) / 3, top / 3, 0].map(t => (
          <span key={t}>{axis(t)}</span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <svg role="img" aria-label={label} viewBox={`0 0 720 ${height}`} preserveAspectRatio="none" className="block w-full" style={{ height }}>
          {[0, 1, 2].map(i => (
            <line key={i} x1="0" x2="720" y1={(i * height) / 3 + 0.5} y2={(i * height) / 3 + 0.5} stroke="#EEF2EC" vectorEffect="non-scaling-stroke" />
          ))}
          <line x1="0" x2="720" y1={height - 0.5} y2={height - 0.5} stroke="#E3EAE1" vectorEffect="non-scaling-stroke" />
          {series.map((s, i) => {
            const p = pts(s.values);
            return (
              <g key={i}>
                {s.fill && <path d={`${path(p)} L720 ${height} L0 ${height} Z`} fill={s.color} fillOpacity="0.1" />}
                <path d={path(p)} fill="none" stroke={s.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
        </svg>
        <AxisLabels labels={labels} edge />
      </div>
    </div>
  );
}

/** Labels under a chart: every one when there are 12 or fewer, otherwise about 7 spread evenly. */
function AxisLabels({ labels, edge }: { labels: string[]; edge?: boolean }) {
  if (labels.length <= 12 && !edge) {
    return (
      <div className="grid text-center text-[11px] text-[#5E6B63]" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
        {labels.map((l, i) => (
          <span key={i} className="truncate">
            {l}
          </span>
        ))}
      </div>
    );
  }
  const n = Math.min(labels.length, 7);
  const picks = Array.from({ length: n }, (_, i) => labels[Math.round((i * (labels.length - 1)) / Math.max(1, n - 1))]);
  return (
    <div className="flex justify-between text-[11px] text-[#5E6B63]">
      {picks.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </div>
  );
}

/** Bucket label: "Nov" for months, "10 Nov" for days, "14:00" for hours. */
export function bucketLabel(iso: string, period: string) {
  const d = new Date(iso);
  if (period === '12m') return d.toLocaleDateString('en', { month: 'short', timeZone: 'UTC' });
  if (period === '24h') return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
  return d.toLocaleDateString('en', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

export function ago(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'yesterday' : `${d} days ago`;
}
