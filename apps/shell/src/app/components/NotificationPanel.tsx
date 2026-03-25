import { useNotificationStore } from '@mednexus/shared/data-access';

function formatTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

export function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const clearAll = useNotificationStore((s) => s.clearAll);

  if (!open) {
    return null;
  }

  return (
    <div className="absolute right-0 top-16 z-50 w-[22rem] overflow-hidden rounded-2xl border border-slate-700/70 bg-[#101827]/95 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          <p className="text-xs text-slate-400">In-app notification history</p>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-slate-400 transition-colors hover:text-white"
        >
          Clear
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-sm text-slate-400">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => markRead(notification.id)}
              className={`block w-full border-b border-slate-800 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                notification.isRead ? 'bg-transparent' : 'bg-emerald-500/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead ? (
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                ) : null}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {formatTimestamp(notification.createdAt)}
              </p>
            </button>
          ))
        )}
      </div>

      <div className="border-t border-slate-800 px-4 py-2 text-right">
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 transition-colors hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
