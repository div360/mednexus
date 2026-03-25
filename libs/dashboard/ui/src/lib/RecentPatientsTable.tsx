import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@mednexus/shared/ui';
import { ExternalLink } from 'lucide-react';
import type { RecentPatient, RecentPatientStatus, RecentPatientsTableProps } from '@mednexus/shared/types';
import { cn } from '@mednexus/shared/utils';

const StatusBadge = ({ status }: { status: RecentPatientStatus }) => {
  const getStyles = () => {
    switch (status) {
      case 'stable':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'observation':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'stable': return 'bg-emerald-400';
      case 'critical': return 'bg-rose-400';
      case 'observation': return 'bg-amber-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider", getStyles())}>
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", getDotColor())} />
      {status}
    </div>
  );
};

export const RecentPatientsTable: React.FC<RecentPatientsTableProps> = ({
  patients,
  navigate,
}) => {
  const goPatients = () => {
    if (navigate) {
      navigate('/patients');
      return;
    }
    window.location.assign('/patients');
  };

  return (
    <Card className="bg-[#1e2335] mt-6 border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between py-5 border-b border-slate-800">
        <div>
          <CardTitle className="text-xl text-white mb-1">Recent Admittances</CardTitle>
          <p className="text-sm text-slate-400">Monitoring patients admitted in the last 48 hours</p>
        </div>
        <button
          type="button"
          onClick={goPatients}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700"
        >
          <span>Registry Explorer</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#171b2a] text-slate-400 text-xs font-medium border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Patient Profile</th>
                <th className="px-6 py-4">Age</th>
                <th className="px-6 py-4">Clinical Condition</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Admission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold font-mono text-sm border border-indigo-500/30">
                      {patient.avatarInitials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{patient.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">ID: {patient.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{patient.age}</td>
                  <td className="px-6 py-4 text-slate-400">{patient.condition}</td>
                  <td className="px-6 py-4 capitalize"><StatusBadge status={patient.status} /></td>
                  <td className="px-6 py-4 text-right text-xs text-slate-400 font-medium font-mono">{patient.admittedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
