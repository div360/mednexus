import * as React from 'react';
import { DataTable, ColumnDef } from '@mednexus/shared/ui';
import { Patient } from '@mednexus/shared/types';
import { PatientStatusBadge } from './PatientStatusBadge';

function calculateAge(dobString: string): number {
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

function timeAgo(dateString: string): string {
  const diffInMs = new Date().getTime() - new Date(dateString).getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInDays === 0) {
    if (diffInHours === 0) return 'Just now';
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
  }
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
}

export function PatientList({ data }: { data: Patient[] }) {

  const getBloodGroupStyle = (bg: string) => {
    if (bg.includes('+')) return 'text-teal-400 font-medium';
    if (bg.includes('-')) return 'text-sky-400 font-medium';
    return 'text-gray-300';
  };

  const columns: ColumnDef<Patient>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
      className: 'font-semibold font-mono text-gray-400',
    },
    {
      header: 'Name',
      cell: (p) => (
        <span className="font-medium text-white">
          {p.firstName} {p.lastName}
        </span>
      ),
    },
    {
      header: 'Age/DOB',
      cell: (p) => {
        const age = calculateAge(p.dateOfBirth);
        return (
          <div className="flex flex-col">
            <span className="text-gray-200">{age}</span>
            <span className="text-xs text-gray-500">{p.dateOfBirth}</span>
          </div>
        );
      },
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
      className: 'capitalize text-gray-300',
    },
    {
      header: 'Blood Group',
      cell: (p) => (
        <span className={getBloodGroupStyle(p.bloodGroup)}>{p.bloodGroup}</span>
      ),
    },
    {
      header: 'Status',
      cell: (p) => <PatientStatusBadge status={p.status} />,
    },
    {
      header: 'Department',
      accessorKey: 'department',
      className: 'text-gray-300',
    },
    {
      header: 'Assigned Doctor',
      accessorKey: 'assignedDoctor',
      className: 'text-gray-300',
    },
    {
      header: 'Admitted At',
      cell: (p) => (
        <span className="text-sm text-gray-400">
          Admitted {timeAgo(p.admittedAt)} ago
        </span>
      ),
    },
  ];

  return <DataTable data={data} columns={columns} keyExtractor={(p) => p.id} />;
}
