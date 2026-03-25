import * as React from 'react';
import { Patient } from '@mednexus/shared/types';
import { PatientStatusBadge } from './PatientStatusBadge';

export function PatientGrid({ data }: { data: Patient[] }) {
  const getVitalsColor = (hr: number) => {
    if (hr > 100 || hr < 60) return 'text-orange-400';
    return 'text-white';
  };

  const getBpColor = (bpStr: string) => {
    if (!bpStr) return 'text-white';
    const systolic = parseInt(bpStr.split('/')[0]);
    if (systolic > 130) return 'text-orange-400';
    return 'text-white';
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 border border-white/5 rounded-xl border-dashed">
        No records found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {data.map((p) => (
        <div key={p.id} className="bg-[#151c2c] border border-white/5 rounded-2xl p-6 flex flex-col hover:border-white/10 transition-colors shadow-lg">
          
          {/* Header Row */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold tracking-wider text-teal-500/70">{p.id}</span>
            <PatientStatusBadge status={p.status} />
          </div>
          
          {/* Name & Condition */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight">{p.firstName} {p.lastName}</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{p.diagnoses[0]?.condition || 'Monitoring'}</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-[#5c6e8e] mb-1.5 uppercase">Heart Rate</div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold ${getVitalsColor(p.vitals?.heartRate)}`}>{p.vitals?.heartRate || '--'}</span>
                <span className="text-[10px] text-gray-500 font-medium">BPM</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-[#5c6e8e] mb-1.5 uppercase">Blood Pressure</div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold ${getBpColor(p.vitals?.bloodPressure)}`}>{p.vitals?.bloodPressure || '--/--'}</span>
                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">mmHg</span>
              </div>
            </div>
            
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-[#5c6e8e] mb-1.5 uppercase">Blood Group</div>
              <div className="text-sm font-medium text-white">{p.bloodGroup}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-[#5c6e8e] mb-1.5 uppercase">Gender</div>
              <div className="text-sm font-medium text-white capitalize">{p.gender}</div>
            </div>
            
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-[#5c6e8e] mb-1.5 uppercase">Department</div>
              <div className="text-sm font-medium text-white truncate pr-2">{p.department}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-[#5c6e8e] mb-1.5 uppercase">Assigned Doctor</div>
              <div className="text-sm font-medium text-white truncate">{p.assignedDoctor || 'Unassigned'}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
