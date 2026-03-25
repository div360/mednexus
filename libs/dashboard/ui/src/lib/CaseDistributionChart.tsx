import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@mednexus/shared/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CaseDistributionData } from '@mednexus/shared/types';

interface CaseDistributionChartProps {
  data: CaseDistributionData[];
  totalActive: number;
}

export const CaseDistributionChart = memo(({ data, totalActive }: CaseDistributionChartProps) => {
  if (!data.length) {
    return (
      <Card className="bg-[#1e2335] border-slate-700/50 h-full flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl text-white mb-1">Case Load</CardTitle>
          <p className="text-sm text-slate-400">Departmental resource allocation</p>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-8">
          <p className="text-sm text-slate-500">No active cases to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1e2335] border-slate-700/50 h-full flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl text-white mb-1">Case Load</CardTitle>
        <p className="text-sm text-slate-400">Departmental resource allocation</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6 mt-4 relative">
        <div className="absolute inset-0 flex items-center justify-center pt-6 pb-20 pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{totalActive}</div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Active</div>
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full mt-6 px-4">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.condition}</span>
              </div>
              <span className="text-slate-400 font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

CaseDistributionChart.displayName = 'CaseDistributionChart';
