import * as React from 'react';

/** Shared status styling for list and grid views (aligned with list view colors). */
export function PatientStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const base =
    'inline-flex items-center rounded-full border font-medium capitalize';

  switch (s) {
    case 'stable':
      return (
        <span
          className={`${base} px-2.5 py-1 text-xs bg-teal-500/10 text-teal-400 border-teal-500/20`}
        >
          Stable
        </span>
      );
    case 'critical':
      return (
        <span
          className={`${base} px-2.5 py-1 text-xs bg-red-500/10 text-red-400 border-red-500/20`}
        >
          Critical
        </span>
      );
    case 'observation':
      return (
        <span
          className={`${base} px-2.5 py-1 text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/20`}
        >
          Observation
        </span>
      );
    case 'active':
      return (
        <span
          className={`${base} px-2.5 py-1 text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20`}
        >
          Active
        </span>
      );
    case 'discharged':
      return (
        <span
          className={`${base} px-2.5 py-1 text-xs bg-slate-500/10 text-slate-400 border-slate-500/20`}
        >
          Discharged
        </span>
      );
    default:
      return (
        <span
          className={`${base} px-2.5 py-1 text-xs bg-gray-500/10 text-gray-400 border-gray-500/20`}
        >
          {status}
        </span>
      );
  }
}
