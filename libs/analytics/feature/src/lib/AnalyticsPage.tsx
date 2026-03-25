import * as React from 'react';
import { useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { usePatientStore, isPatientVisitDue } from '@mednexus/patients/data-access';

const COLORS = {
  teal: '#2dd4bf',
  cyan: '#22d3ee',
  blue: '#60a5fa',
  indigo: '#818cf8',
  orange: '#fb923c',
  gray: '#9ca3af',
  darkBorder: 'rgba(255,255,255,0.05)'
};

const PIE_COLORS = [COLORS.teal, COLORS.blue, COLORS.indigo, COLORS.cyan, COLORS.orange];

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white text-sm font-medium">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function AnalyticsPage() {
  const patients = usePatientStore(s => s.patients);
  const isLoading = usePatientStore(s => s.isLoading);
  const queryPatients = usePatientStore(s => s.queryPatients);

  useEffect(() => {
    if (patients.length === 0) {
      void queryPatients({
        search: '',
        statusFilter: 'All',
        departmentFilter: 'All',
      });
    }
  }, [patients.length, queryPatients]);

  // Derived KPIs
  const activePatients = useMemo(() => patients.filter(p => p.status !== 'discharged'), [patients]);
  
  const criticalCount = useMemo(() => 
    activePatients.filter(p => p.status === 'critical' || p.status === 'observation').length, 
  [activePatients]);
  
  const criticalRatio = activePatients.length 
    ? Math.round((criticalCount / activePatients.length) * 100) 
    : 0;
  
  const overdueCount = useMemo(() => 
    activePatients.filter(p => isPatientVisitDue(p)).length, 
  [activePatients]);
  
  const recentAdmissions = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return activePatients.filter(p => new Date(p.admittedAt) >= sevenDaysAgo).length;
  }, [activePatients]);

  // Chart Data: Department Occupancy
  const deptData = useMemo(() => {
    const counts: Record<string, number> = {};
    activePatients.forEach(p => {
      counts[p.department] = (counts[p.department] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value);
  }, [activePatients]);

  // Chart Data: Status Breakdown
  const statusData = useMemo(() => {
    const counts: Record<string, number> = { stable: 0, critical: 0, observation: 0, improving: 0 };
    activePatients.forEach(p => {
      const s = p.status.toLowerCase();
      if (counts[s] !== undefined) counts[s]++;
      else counts[s] = 1;
    });
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        value 
      }));
  }, [activePatients]);

  // Chart Data: Age Demographics
  const ageData = useMemo(() => {
    const brackets = { '0-18': 0, '19-35': 0, '36-50': 0, '51-65': 0, '65+': 0 };
    activePatients.forEach(p => {
      const dob = new Date(p.dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age <= 18) brackets['0-18']++;
      else if (age <= 35) brackets['19-35']++;
      else if (age <= 50) brackets['36-50']++;
      else if (age <= 65) brackets['51-65']++;
      else brackets['65+']++;
    });
    return Object.entries(brackets).map(([name, Patients]) => ({ name, Patients }));
  }, [activePatients]);

  if (isLoading && patients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin mb-4"></div>
          <span className="text-slate-400 tracking-widest uppercase text-xs">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full text-gray-200 font-sans antialiased">
      {/* Header */}
      <div className="mb-8 p-8 md:p-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Analytics Dashboard</h1>
        <p className="text-gray-400">High-level insights across all clinical departments.</p>
      </div>

      <div className="px-8 md:px-0">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col hover:border-white/10 transition-colors">
            <span className="text-[10px] font-bold text-[#5c6e8e] uppercase tracking-widest mb-2">Active Patients</span>
            <span className="text-4xl font-bold text-white mb-1">{activePatients.length}</span>
            <span className="text-xs text-teal-400 font-medium">Tracking across all wards</span>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col hover:border-white/10 transition-colors">
            <span className="text-[10px] font-bold text-[#5c6e8e] uppercase tracking-widest mb-2">Critical Care Ratio</span>
            <span className="text-4xl font-bold text-white mb-1">{criticalRatio}%</span>
            <span className="text-xs text-orange-400 font-medium">{criticalCount} critical / observation</span>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col hover:border-white/10 transition-colors">
            <span className="text-[10px] font-bold text-[#5c6e8e] uppercase tracking-widest mb-2">Attention Required</span>
            <span className="text-4xl font-bold text-white mb-1">{overdueCount}</span>
            <span className={`text-xs font-medium ${overdueCount > 0 ? 'text-orange-400' : 'text-teal-400'}`}>
              {overdueCount > 0 ? 'Doctor visits overdue' : 'All schedules clear'}
            </span>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col hover:border-white/10 transition-colors">
            <span className="text-[10px] font-bold text-[#5c6e8e] uppercase tracking-widest mb-2">Recent Admissions</span>
            <span className="text-4xl font-bold text-white mb-1">{recentAdmissions}</span>
            <span className="text-xs text-[#5c6e8e] font-medium">Admitted in the last 7 days</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
          
          {/* Department Occupancy */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Department Occupancy</h3>
            <div className="mt-6 w-full h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.darkBorder} horizontal={true} vertical={false} />
                  <XAxis type="number" stroke={COLORS.gray} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke={COLORS.gray} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill={COLORS.teal} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Patient Status Distribution</h3>
            <div className="mt-6 w-full h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => {
                       let color = PIE_COLORS[index % PIE_COLORS.length];
                       if (entry.name === 'Critical') color = COLORS.orange;
                       if (entry.name === 'Stable') color = COLORS.cyan;
                       if (entry.name === 'Observation') color = COLORS.indigo;
                       return <Cell key={`cell-${index}`} fill={color} stroke="rgba(0,0,0,0)" />;
                    })}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: COLORS.gray }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Age Demographics */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 shadow-xl lg:col-span-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Age Demographics</h3>
            <div className="mt-6 w-full h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.darkBorder} vertical={false} />
                  <XAxis dataKey="name" stroke={COLORS.gray} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={COLORS.gray} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="Patients" fill={COLORS.blue} radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
