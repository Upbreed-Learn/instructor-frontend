import { Button } from './ui/button';

const ErrorState = ({ onRetry }: { onRetry?: () => void }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg bg-[#FFF5F5] p-6">
      <svg
        className="h-10 w-10 text-[#D14343]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>
      <p className="text-sm font-semibold text-[#D14343]">
        Something went wrong
      </p>
      <p className="text-xs text-[#6B6B6B]">
        Unable to fetch data. Please try again.
      </p>
      <div className="flex gap-2">
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );
};

export default ErrorState;
