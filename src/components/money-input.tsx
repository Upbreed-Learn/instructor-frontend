import type { InputHTMLAttributes } from 'react';

/** "500000" → "500,000" (keeps up to two decimals while typing). */
export const withCommas = (value: string | number) => {
  const [whole, dec] = String(value ?? '').replace(/[^\d.]/g, '').split('.');
  const grouped = whole.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return dec === undefined ? grouped : `${grouped}.${dec.slice(0, 2)}`;
};

/** A money box that shows thousands separators as you type; onValue gets the plain number text ("500000"). */
export default function MoneyInput({
  value,
  onValue,
  ...rest
}: { value: string | number; onValue: (plain: string) => void } & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>) {
  return (
    <input
      {...rest}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={withCommas(value)}
      onChange={e => onValue(withCommas(e.target.value).replace(/,/g, ''))}
    />
  );
}
