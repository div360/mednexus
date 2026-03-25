import { useState, useMemo, useEffect } from 'react';
import type { ViewMode } from '@mednexus/shared/types';
import { PatientList } from './PatientList';
import { PatientGrid } from './PatientGrid';
import { AddPatientDialog } from './AddPatientDialog';
import { usePatientStore } from '@mednexus/patients/data-access';

export function PatientsPage() {
  const patients = usePatientStore((s) => s.patients);
  const filterMetadata = usePatientStore((s) => s.filterMetadata);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    void usePatientStore.getState().loadFilterMetadata();
  }, []);

  useEffect(() => {
    const debounceMs = searchQuery.trim() ? 300 : 0;
    const handle = window.setTimeout(() => {
      void usePatientStore.getState().queryPatients({
        search: searchQuery,
        statusFilter,
        departmentFilter: deptFilter,
      });
    }, debounceMs);
    return () => window.clearTimeout(handle);
  }, [searchQuery, statusFilter, deptFilter]);

  const uniqueDepartments = useMemo(() => {
    const fromMeta = filterMetadata?.departments ?? [];
    return ['All', ...fromMeta];
  }, [filterMetadata]);

  const uniqueStatuses = useMemo(() => {
    const fromMeta = filterMetadata?.statuses ?? [];
    return ['All', ...fromMeta];
  }, [filterMetadata]);

  const activePatientsCount = useMemo(
    () => patients.filter((p) => p.status !== 'discharged').length,
    [patients]
  );

  const activeItemsPerPage =
    itemsPerPage === 'all' ? patients.length || 1 : itemsPerPage;
  const totalPages = Math.ceil(patients.length / activeItemsPerPage) || 1;

  const paginatedPatients = useMemo(() => {
    if (itemsPerPage === 'all') return patients;
    const start = (currentPage - 1) * itemsPerPage;
    return patients.slice(start, start + itemsPerPage);
  }, [patients, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, deptFilter, itemsPerPage]);

  const startIndex =
    patients.length === 0
      ? 0
      : (currentPage - 1) * activeItemsPerPage + 1;
  const endIndex = Math.min(currentPage * activeItemsPerPage, patients.length);

  return (
    <div className="w-full text-gray-200 font-sans antialiased">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Patient Registry
          </h1>
          <p className="text-gray-400">
            {activePatientsCount.toLocaleString()} active clinical profiles across
            system.
          </p>
        </div>
        <div className="shrink-0">
          <AddPatientDialog />
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5 shadow-xl">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <div className="relative w-full xl:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clinical records, IDs, or symptoms..."
              className="w-full bg-[#0f172a]/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center p-1 bg-[#0f172a]/50 border border-white/10 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded outline-none transition-all ${viewMode === 'list' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded outline-none transition-all ${viewMode === 'grid' ? 'bg-brand-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Grid
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 text-sm font-medium text-gray-300 bg-[#0f172a]/50 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer capitalize"
              >
                {uniqueStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="bg-[#1e293b] text-white"
                  >
                    Status: {status}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <select
                value={itemsPerPage.toString()}
                onChange={(e) =>
                  setItemsPerPage(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="appearance-none pl-9 pr-8 py-2.5 text-sm font-medium text-gray-300 bg-[#0f172a]/50 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="10" className="bg-[#1e293b] text-white">
                  10 / page
                </option>
                <option value="15" className="bg-[#1e293b] text-white">
                  15 / page
                </option>
                <option value="20" className="bg-[#1e293b] text-white">
                  20 / page
                </option>
                <option value="all" className="bg-[#1e293b] text-white">
                  All
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 text-sm font-medium text-gray-300 bg-[#0f172a]/50 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                {uniqueDepartments.map((dept) => (
                  <option
                    key={dept}
                    value={dept}
                    className="bg-[#1e293b] text-white"
                  >
                    Dept: {dept}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-[400px]">
          {viewMode === 'list' ? (
            <PatientList data={paginatedPatients} />
          ) : (
            <PatientGrid data={paginatedPatients} />
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-gray-400 gap-4">
        <div>
          Showing{' '}
          <span className="font-medium text-white">
            {startIndex} - {endIndex}
          </span>{' '}
          of {patients.length} patients
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-8 h-8 flex items-center justify-center rounded bg-[#1e293b] border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageChange(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors font-medium border ${
                currentPage === pageNum
                  ? 'bg-brand-600 text-white shadow border-transparent'
                  : 'bg-[#0f172a] border-white/10 hover:bg-[#1e293b]'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-8 h-8 flex items-center justify-center rounded bg-[#1e293b] border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
