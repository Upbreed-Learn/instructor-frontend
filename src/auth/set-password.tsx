import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { https } from '@/lib/https';
import { useMutation, useQuery } from '@tanstack/react-query';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Cookies from 'js-cookie';
import { Eye, EyeOff, LoaderPinwheelIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

const RULES: [RegExp, string][] = [
  [/.{8,}/, 'At least 8 characters'],
  [/[A-Z]/, 'An uppercase letter'],
  [/[a-z]/, 'A lowercase letter'],
  [/[0-9]/, 'A number'],
  [/[^A-Za-z0-9]/, 'A symbol (e.g. !@#)'],
];

/** Opened from the welcome email: new instructors choose their own password. */
const SetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get('email') ?? '';
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const ok = RULES.every(([r]) => r.test(password)) && password === confirm;

  // Same device id the login page uses, so this counts as a normal sign-in.
  const { data: deviceSignature } = useQuery({
    queryKey: ['deviceFingerprint'],
    queryFn: async () => (await (await FingerprintJS.load()).get()).visitorId,
    staleTime: Infinity,
  });
  const save = useMutation({
    mutationFn: () =>
      https
        .post('/auth/password/set', { email, token, password, deviceSignature, userType: 'INSTRUCTOR' })
        .then(r => r.data as { token?: string }),
    onSuccess: data => {
      if (data.token) {
        Cookies.set('rf', data.token);
        toast.success('Welcome to Upbreed Learn!');
        navigate('/');
      } else {
        toast.success('Password set', { description: 'You can now log in.' });
        navigate('/auth/login');
      }
    },
    onError: (e: any) => toast.error('Could not set password', { description: e?.response?.data?.message ?? 'Please try again.' }),
  });

  if (!email || !token) {
    return (
      <div className="flex flex-col gap-3 text-sm">
        <p>This link is incomplete. Please open the link from your welcome email again.</p>
        <Link to="/auth/reset-password" className="font-semibold text-[#305B43] underline">
          Or request a password reset code
        </Link>
      </div>
    );
  }

  return (
    <form
      className="flex w-full max-w-117.25 flex-col gap-5"
      onSubmit={e => {
        e.preventDefault();
        if (ok) save.mutate();
      }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#00230F]">Set your password</p>
        <p className="text-xs text-[#737373]">For {email}</p>
      </div>
      <div className="relative">
        <Input
          type={show ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="New password"
          autoComplete="new-password"
          className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] pr-9 placeholder:text-[#9B9B9B]"
        />
        <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(s => !s)} className="absolute top-2 right-2 cursor-pointer text-[#9B9B9B]">
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
      <Input
        type={show ? 'text' : 'password'}
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        placeholder="Confirm password"
        autoComplete="new-password"
        className="h-9 rounded-lg border-[#9B9B9B] bg-[#47474700] placeholder:text-[#9B9B9B]"
      />
      <ul className="grid grid-cols-2 gap-1 text-[11px]">
        {RULES.map(([r, label]) => (
          <li key={label} className={r.test(password) ? 'text-[#305B43]' : 'text-[#9B9B9B]'}>
            {r.test(password) ? '✓' : '•'} {label}
          </li>
        ))}
        <li className={password && password === confirm ? 'text-[#305B43]' : 'text-[#9B9B9B]'}>
          {password && password === confirm ? '✓' : '•'} Passwords match
        </li>
      </ul>
      <Button type="submit" disabled={!ok || save.isPending}>
        {save.isPending ? <LoaderPinwheelIcon className="animate-spin" /> : 'Set password'}
      </Button>
    </form>
  );
};

export default SetPassword;
