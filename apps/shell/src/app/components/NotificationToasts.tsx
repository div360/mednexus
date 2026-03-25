import { useEffect } from 'react';
import { useNotificationStore } from '@mednexus/shared/data-access';

export function NotificationToasts({
  onShowAll,
}: {
  onShowAll: () => void;
}) {
  const toasts = useNotificationStore((s) => s.toasts);
  const dismissToast = useNotificationStore((s) => s.dismissToast);
  const visibleToasts = toasts.slice(0, 3);
  const hiddenCount = Math.max(0, toasts.length - visibleToasts.length);

  useEffect(() => {
    const timers = visibleToasts.map((toast) =>
      window.setTimeout(() => dismissToast(toast.id), 5000)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [dismissToast, visibleToasts]);

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {visibleToasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-2xl border border-emerald-500/30 bg-[#101827]/95 p-4 shadow-2xl backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{toast.title}</p>
              <p className="mt-1 text-sm text-slate-300">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-xs text-slate-400 transition-colors hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={onShowAll}
          className="pointer-events-auto rounded-2xl border border-slate-700/70 bg-[#101827]/95 px-4 py-3 text-left text-sm text-slate-300 shadow-2xl backdrop-blur transition-colors hover:border-emerald-500/30 hover:text-white"
        >
          {hiddenCount} more notification{hiddenCount > 1 ? 's' : ''}
        </button>
      ) : null}
    </div>
  );
}
