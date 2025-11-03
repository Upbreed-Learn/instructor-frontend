import { useRouteError, isRouteErrorResponse } from 'react-router';
import { useNavigate, Link } from 'react-router';

export default function ErrorPage() {
  const routeError = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(routeError)
    ? `${routeError.status} ${routeError.statusText}`
    : ((routeError as Error)?.message ?? 'An unexpected error occurred');

  const details = (() => {
    try {
      return JSON.stringify(routeError, null, 2);
    } catch {
      return String(routeError);
    }
  })();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6FBF6] p-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg shadow">
        <header className="bg-[#305B43] px-6 py-6">
          <h1 className="text-2xl font-extrabold text-white">
            Something went wrong
          </h1>
          <p className="mt-1 text-sm text-[#DFF6E6]">
            We {`couldn’t`} load this page. Try one of the options below.
          </p>
        </header>

        <main className="bg-white px-6 py-6">
          <p className="text-sm font-semibold text-[#00230F]">Error</p>
          <p className="mt-2 text-xs wrap-break-word text-[#6B6B6B]">
            {message}
          </p>

          <details className="mt-4 text-xs text-[#6B6B6B]">
            <summary className="cursor-pointer">Show technical details</summary>
            <pre className="mt-2 max-h-56 overflow-auto rounded bg-[#F4F7F4] p-3 text-[12px] text-[#263626]">
              {details}
            </pre>
          </details>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded bg-[#D0EA50] px-4 py-2 font-semibold text-black"
            >
              Reload
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded border border-[#E6E6E6] bg-transparent px-4 py-2 font-semibold text-[#305B43]"
            >
              Go home
            </button>

            <a
              href={`mailto:hello@yourteam.com?subject=App%20Error%20Report&body=${encodeURIComponent(
                `Error: ${message}\n\nDetails:\n${details}`,
              )}`}
              className="inline-flex items-center gap-2 rounded bg-[#305B43] px-4 py-2 font-semibold text-white"
            >
              Report
            </a>

            <Link
              to={-1 as unknown as string}
              className="inline-flex items-center gap-2 rounded border border-transparent bg-transparent px-4 py-2 text-[#9C9C9C] hover:underline"
            >
              Back
            </Link>
          </div>

          <p className="mt-4 text-xs text-[#8A8A8A]">
            If this keeps happening, copy the details above and contact support.
          </p>
        </main>
      </div>
    </div>
  );
}
