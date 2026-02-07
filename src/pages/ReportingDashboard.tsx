import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, CheckCircle, PlayCircle, Filter, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { useApp, ReportRow } from '../contexts/AppContext';

type StatusFilter = 'all' | 'Yet to Start' | 'In Progress' | 'Completed';

const COLUMNS = [
  { key: 'srNo', label: 'Sr No.' },
  { key: 'courseName', label: 'Course Name' },
  { key: 'participantName', label: 'Participant' },
  { key: 'enrolledDate', label: 'Enrolled Date' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'timeSpent', label: 'Time Spent' },
  { key: 'completion', label: 'Completion %' },
  { key: 'completedDate', label: 'Completed Date' },
  { key: 'status', label: 'Status' },
] as const;

export default function ReportingDashboard() {
  const navigate = useNavigate();
  const { getReportData } = useApp();
  const report = getReportData();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string>('srNo');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(COLUMNS.map(c => c.key))
  );

  const filteredRows = useMemo(() => {
    let rows = report.rows;
    if (statusFilter !== 'all') {
      rows = rows.filter(r => r.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(r =>
        r.courseName.toLowerCase().includes(q) ||
        r.participantName.toLowerCase().includes(q)
      );
    }
    rows.sort((a, b) => {
      const aVal = a[sortKey as keyof ReportRow];
      const bVal = b[sortKey as keyof ReportRow];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return rows;
  }, [report.rows, statusFilter, searchQuery, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const cards = [
    { label: 'Total Participants', value: report.totalParticipants, filter: 'all' as StatusFilter, icon: <Users size={24} />, color: 'bg-blue-500' },
    { label: 'Yet to Start', value: report.yetToStart, filter: 'Yet to Start' as StatusFilter, icon: <Clock size={24} />, color: 'bg-amber-500' },
    { label: 'In Progress', value: report.inProgress, filter: 'In Progress' as StatusFilter, icon: <PlayCircle size={24} />, color: 'bg-brand-500' },
    { label: 'Completed', value: report.completed, filter: 'Completed' as StatusFilter, icon: <CheckCircle size={24} />, color: 'bg-green-500' },
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Yet to Start': 'bg-amber-50 text-amber-600',
      'In Progress': 'bg-blue-50 text-blue-600',
      'Completed': 'bg-green-50 text-green-600',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-nature-light pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/courses')} className="p-2 rounded-lg hover:bg-brand-100 text-brand-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-brand-900">Reporting Dashboard</h1>
            <p className="text-sm text-brand-500">Course-wise learner progress overview</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(card => (
            <button
              key={card.label}
              onClick={() => setStatusFilter(card.filter)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                statusFilter === card.filter
                  ? 'border-brand-500 bg-white shadow-lg'
                  : 'border-brand-200 bg-white hover:border-brand-400'
              }`}
            >
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-brand-900">{card.value}</p>
              <p className="text-sm text-brand-500">{card.label}</p>
            </button>
          ))}
        </div>

        {/* Search + Column Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-brand-200 rounded-lg bg-white text-brand-900 text-sm placeholder-brand-400"
              placeholder="Search by course or participant name..."
            />
          </div>
          <button
            onClick={() => setShowColumnPanel(!showColumnPanel)}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-brand-200 rounded-lg text-sm font-semibold text-brand-600 hover:bg-brand-50"
          >
            <Settings2 size={16} /> Columns
          </button>
        </div>

        {/* Column Customizer */}
        {showColumnPanel && (
          <div className="mb-4 p-4 bg-brand-50 rounded-xl border border-brand-200 shadow-sm">
            <p className="text-sm font-semibold text-brand-600 mb-3">Show/Hide Columns</p>
            <div className="flex flex-wrap gap-3">
              {COLUMNS.map(col => (
                <label key={col.key} className="flex items-center gap-2 text-sm text-brand-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="rounded border-brand-600 text-brand-600 focus:ring-brand-500"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-brand-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-50 border-b border-brand-200">
                  {COLUMNS.filter(c => visibleColumns.has(c.key)).map(col => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-4 py-3 text-left font-semibold text-brand-600 cursor-pointer hover:text-brand-900 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.size} className="px-4 py-12 text-center text-brand-400">
                      No data matching the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, i) => (
                    <tr key={i} className="border-b border-brand-100 hover:bg-brand-50">
                      {visibleColumns.has('srNo') && <td className="px-4 py-3 text-brand-500">{row.srNo}</td>}
                      {visibleColumns.has('courseName') && <td className="px-4 py-3 font-medium text-brand-900">{row.courseName}</td>}
                      {visibleColumns.has('participantName') && <td className="px-4 py-3 text-brand-700">{row.participantName}</td>}
                      {visibleColumns.has('enrolledDate') && <td className="px-4 py-3 text-brand-500">{row.enrolledDate}</td>}
                      {visibleColumns.has('startDate') && <td className="px-4 py-3 text-brand-500">{row.startDate}</td>}
                      {visibleColumns.has('timeSpent') && <td className="px-4 py-3 text-brand-500">{row.timeSpent}</td>}
                      {visibleColumns.has('completion') && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-brand-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-500 rounded-full"
                                style={{ width: `${row.completion}%` }}
                              />
                            </div>
                            <span className="text-xs text-brand-400">{row.completion}%</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.has('completedDate') && <td className="px-4 py-3 text-brand-500">{row.completedDate}</td>}
                      {visibleColumns.has('status') && <td className="px-4 py-3">{statusBadge(row.status)}</td>}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
