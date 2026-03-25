import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@mednexus/shared/ui';
import { Users, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import type { DashboardMetrics } from '@mednexus/shared/types';
import { cn } from '@mednexus/shared/utils';

interface SummaryCardsProps {
  metrics: DashboardMetrics;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Total Patients',
      value: metrics.totalPatients.value.toLocaleString(),
      trend: `${metrics.totalPatients.trend > 0 ? '+' : ''}${metrics.totalPatients.trend}%`,
      trendLabel: 'from last week',
      icon: Users,
      trendUp: metrics.totalPatients.trend > 0,
      badge: true
    },
    {
      title: 'Active Cases',
      value: metrics.activeCases.value.toLocaleString(),
      icon: Activity,
    },
    {
      title: 'Critical Alerts',
      value: metrics.criticalAlerts.value.toLocaleString(),
      icon: AlertTriangle,
      alertBadge: 'Immediate Action'
    },
    {
      title: 'Discharged Today',
      value: metrics.dischargedToday.value.toLocaleString(),
      icon: CheckCircle,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="bg-[#1e2335] border-slate-700/50 flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="bg-slate-800/50 p-2 rounded-lg">
                <Icon className={cn("w-5 h-5", card.title === 'Critical Alerts' ? 'text-rose-500' : 
                                                 card.title === 'Active Cases' ? 'text-teal-400' :
                                                 card.title === 'Discharged Today' ? 'text-slate-400' :
                                                 'text-indigo-400')} />
              </div>
              {card.badge && (
                <div className="bg-teal-500/10 text-teal-400 text-xs font-medium px-2 py-1 rounded-md flex items-center">
                  <span className="mr-1">↗</span> {card.trend}
                </div>
              )}
              {card.alertBadge && (
                <div className="bg-rose-500/10 text-rose-400 text-xs font-medium px-2 py-1 rounded-md">
                  {card.alertBadge}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mb-1">{card.title}</p>
              <div className="text-3xl font-bold text-white">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
