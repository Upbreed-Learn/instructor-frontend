import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { UserDetailsType } from '@/lib/constants';
import { axiosInstance } from '@/lib/https';
import { useGetUserDetails } from '@/queries/hooks';
import { useUserIdStore } from '@/store/user-id-control';
import { useMutation } from '@tanstack/react-query';
import { Headset, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const SUPPORT_EMAIL = 'hello@upbreedlearn.com';
const SUPPORT_PHONE = '+2348092714000';

/** "Talk to Us": a message to the Upbreed team (lands in Admin › Contact messages). */
const TalkToUs = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { userId } = useUserIdStore();
  const { data } = useGetUserDetails(userId!!);
  const me: UserDetailsType | undefined = data?.data?.data;

  const send = useMutation({
    mutationFn: () =>
      axiosInstance.post('/contact', {
        firstName: me?.fname || 'Instructor',
        lastName: me?.lname || '-',
        email: me?.email,
        message: `[Instructor] ${message.trim()}`,
      }),
    onSuccess: () => {
      toast.success('Message sent', { description: "We'll reply to your email, usually within one working day." });
      setMessage('');
      setOpen(false);
    },
    onError: (e: any) => toast.error('Could not send', { description: e?.response?.data?.message ?? 'Please try again.' }),
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full cursor-pointer flex-col items-start gap-2 rounded-xl bg-white/10 p-4 text-left text-white transition-colors hover:bg-white/15"
      >
        <Headset className="size-5 text-[#D0EA50]" />
        <span className="text-xs font-semibold">Need help?</span>
        <span className="text-[11px] text-white/70">Questions about payouts, courses or sessions?</span>
        <span className="mt-1 rounded-md bg-[#D0EA50] px-3 py-1.5 text-[11px] font-semibold text-[#00230F]">Talk to Us</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Talk to Us</DialogTitle>
            <DialogDescription>Send the Upbreed team a message. We&apos;ll reply to {me?.email ?? 'your email'}.</DialogDescription>
          </DialogHeader>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            maxLength={4900}
            placeholder="How can we help?"
            className="h-36 w-full rounded-lg border border-[#D4D4D4] p-3 text-sm outline-none focus:border-[#305B43]"
          />
          <Button disabled={!message.trim() || !me?.email || send.isPending} onClick={() => send.mutate()}>
            {send.isPending ? 'Sending…' : 'Send message'}
          </Button>
          <div className="flex flex-col gap-1.5 border-t pt-3 text-xs text-[#737373]">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2">
              <Mail className="size-3.5" /> {SUPPORT_EMAIL}
            </a>
            <a href={`tel:${SUPPORT_PHONE}`} className="flex items-center gap-2">
              <Phone className="size-3.5" /> {SUPPORT_PHONE}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TalkToUs;
