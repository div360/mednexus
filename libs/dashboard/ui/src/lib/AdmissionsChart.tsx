import * as React from 'react';
import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@mednexus/shared/ui';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { AdmissionsChartProps } from '@mednexus/shared/types';

export const AdmissionsChart = memo(({ data, monthlyData }: AdmissionsChartProps) => {
  const [view, setView] = React.useState<'WEEK' | 'MONTH'>('WEEK');

  const chartData = view === 'WEEK' ? data : monthlyData;

  const btnBase = "text-xs px-3 py-1 rounded border transition-colors";
  const btnActive = "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500";
  const btnInactive = "bg-slate-700/50 hover:bg-slate-600 text-slate-300 border-slate-600";

  return (
    <Card className="bg-[#1e2335] border-slate-700/50 h-full flex flex-col">
      <CardHeader className="pb-0 flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl text-white mb-1">Patient Admissions</CardTitle>
          <p className="text-sm text-slate-400">Real-time throughput analytics</p>
        </div>
        <div className="flex space-x-2">
          <button type="button" onClick={() => setView('WEEK')} className={`${btnBase} ${view === 'WEEK' ? btnActive : btnInactive}`}>WEEK</button>
          <button type="button" onClick={() => setView('MONTH')} className={`${btnBase} ${view === 'MONTH' ? btnActive : btnInactive}`}>MONTH</button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px] p-0 pt-6 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} dy={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Area type="monotone" dataKey="admissions" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorAdmissions)" activeDot={{r: 6, fill: '#fff', stroke: '#818cf8', strokeWidth: 3}} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

AdmissionsChart.displayName = 'AdmissionsChart';
