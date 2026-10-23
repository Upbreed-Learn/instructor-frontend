import { Button } from '@/components/ui/button';
import { useQueryState } from 'nuqs';
import TotalRevenueChart from '@/overview/total-revenue';
import { money, useEarnings } from '@/lib/earnings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ReactNode } from 'react';

const Earnings = () => {
  const { data, isPending, isError } = useEarnings();
  const currencies = data?.currencies.length ? data.currencies : ['NGN'];
  const [currency, setCurrency] = useQueryState('currency', { defaultValue: 'NGN' });
  const cur = currencies.includes(currency) ? currency : currencies[0];
  const e = data?.byCurrency[cur] ?? { totalEarning: 0, monthlyEarning: 0, paidOut: 0, pendingPayout: 0 };

  return (
    <div className="flex flex-col gap-3 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Earnings</h1>
          <p className="text-xs text-[#737373]">
            From your 1-on-1 sessions. You keep {data?.sharePercent ?? 80}% of every paid session.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {currencies.length > 1 && (
            <div className="flex gap-1">
              {currencies.map(c => (
                <Button key={c} variant={c === cur ? 'default' : 'outline'} className="h-8 rounded-xl font-bold" onClick={() => setCurrency(c)}>
                  {c}
                </Button>
              ))}
            </div>
          )}
          <EarningsDialog>
            <span className="text-[8px]/[100%] font-semibold text-[#00230F]">
              {' '}
              <span className="text-[#FF0000]">*</span> Payment are rolled out quarterly
            </span>
          </EarningsDialog>
        </div>
      </div>
      {isError ? (
        <p className="text-sm text-red-600">Could not load your earnings.</p>
      ) : (
        <div className="flex items-center gap-7 rounded-lg pt-6.5 pb-9 shadow-[0px_2.03px_2.03px_0px_#0000000A]">
          {[
            ['Paid to you', e.paidOut],
            ['This month', e.monthlyEarning],
            ['Total earned', e.totalEarning],
            ['Pending payout', e.pendingPayout],
          ].map(([label, value], i) => (
            <div key={label as string} className={`flex basis-full flex-col gap-0.5 ${i > 0 ? 'border-l border-[#9B9B9B] pl-7' : ''}`}>
              <p className="text-4xl/[100%] font-bold">{isPending ? '…' : money(value as number, cur)}</p>
              <p className="text-xs/[100%] font-semibold text-[#9C9C9C]">{label}</p>
            </div>
          ))}
        </div>
      )}
      <TotalRevenueChart height={180} className="flex-2/3" />
      <div className="flex flex-col gap-2 rounded-lg p-4 shadow-[0px_2.03px_2.03px_0px_#0000000A]">
        <p className="text-sm font-bold">Payout history</p>
        {!data?.payouts.length ? (
          <p className="text-xs text-[#737373]">No payouts yet.</p>
        ) : (
          <ul className="flex flex-col gap-1 text-sm">
            {data.payouts.map(p => (
              <li key={p.id} className="flex justify-between border-b border-[#EDEDED] py-1">
                <span>
                  {new Date(p.paidAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  {p.note && <span className="text-[#737373]"> · {p.note}</span>}
                </span>
                <span className="font-semibold">{money(p.amount, p.currency)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Earnings;

export const EarningsDialog = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent className="bg-[#EFEFEF]">
        <DialogHeader className="sr-only">
          <DialogTitle>Payment Terms for UpbreedLearn</DialogTitle>
          <DialogDescription>
            Read more about the payment terms for UpbreedLearn
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 text-xs/4 font-medium">
          <p>Payment Terms for UpbreedLearn</p>
          <ol className="flex list-inside list-decimal flex-col gap-3">
            <li>
              Payment Schedule: Payments will be processed every three months on
              the 4th day of the first month of each quarterly period (January,
              April, July, and October).
            </li>{' '}
            <li>
              Payment Method: All payments will be made via bank transfer.
            </li>
            <li>
              Account Information: To ensure timely payments, recipients must
              provide accurate and up-to-date bank account details in their
              account settings.
            </li>{' '}
            <li>
              Responsibility: It is the recipient's responsibility to ensure
              that the provided bank account is valid and able to receive
              payments.
            </li>{' '}
            <li>
              Processing Timeline: Payments will be initiated on the stated
              date, and processing times may vary depending on the recipient's
              bank.
            </li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
};
