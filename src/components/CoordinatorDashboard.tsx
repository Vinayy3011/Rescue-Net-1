
import React, { useState, useMemo } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { EmergencyType, EmergencyStatus } from '../types/emergency';
import { EmergencyMap } from './EmergencyMap';
import { EmergencyDetailsModal } from './EmergencyDetailsModal';
import {
  ShieldAlert,
  Search,
  Filter,
  PlusCircle,
  RotateCcw,
  Eye,
  CheckCircle2,
  Clock,
  Radio,
  Users,
  AlertCircle,
  Download
} from 'lucide-react';

export const CoordinatorDashboard: React.FC = () => {
  const {
    emergencies,
    teams,
    selectedEmergencyId,
    setSelectedEmergencyId,
    updateEmergencyStatus,
    assignTeamToEmergency,
    simulateIncomingAlert,
    resetDemoData,
    setActiveTab
  } = useEmergency();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | EmergencyStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | EmergencyType>('All');
  const [quickAssignTarget, setQuickAssignTarget] = useState<string | null>(null);

  // Statistics calculation
  const totalCount = emergencies.length;
  const pendingCount = emergencies.filter((e) => e.status === 'Pending').length;
  const inProgressCount = emergencies.filter((e) => e.status === 'In Progress').length;
  const resolvedCount = emergencies.filter((e) => e.status === 'Resolved').length;
  const activeTeamsCount = teams.filter((t) => t.status === 'Dispatched').length;

  // Filtered emergencies list
  const filteredEmergencies = useMemo(() => {
    return emergencies.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.victimName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesType = typeFilter === 'All' || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [emergencies, searchTerm, statusFilter, typeFilter]);

  const downloadCsv = () => {
    const headers = [
      'Emergency_ID',
      'Victim_Name',
      'Phone',
      'Emergency_Type',
      'Priority',
      'Status',
      'Location_Name',
      'Latitude',
      'Longitude',
      'Timestamp',
      'Assigned_Team',
      'Message'
    ];

    const rows = filteredEmergencies.map((e) => [
      e.id,
      `"${(e.victimName || '').replace(/"/g, '""')}"`,
      `"${(e.phone || 'N/A').replace(/"/g, '""')}"`,
      e.type,
      e.priority,
      e.status,
      `"${(e.locationName || '').replace(/"/g, '""')}"`,
      e.latitude,
      e.longitude,
      e.timestamp,
      `"${(e.assignedTeamName || 'Unassigned').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rescue-net-emergencies-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">

      {/* Dashboard Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-green-700" />
            <span>Operational Center · Alandi / Pune Sector Dispatch</span>
          </div>

          <h1 className="text-3xl font-extrabold text-green-950 tracking-tight">
            Coordinator Incident Dashboard
          </h1>

          <p className="text-gray-600 text-sm mt-1">
            Real-time emergency monitoring, geospatial telemetry, rapid team allocation, and resolution management.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={simulateIncomingAlert}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-100 transition-colors cursor-pointer"
            title="Simulate a live distress signal sent from victim smartphone"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Simulate Incoming SOS</span>
          </button>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-green-800 hover:text-green-950 bg-white hover:bg-green-100 border border-green-200 rounded-lg transition-colors cursor-pointer"
            title="Reset to default Alandi & Pune demo emergencies"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Emergencies */}
        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-600 text-xs font-medium mb-2">
            <span>Total Alerts</span>
            <ShieldAlert className="w-4 h-4 text-green-700" />
          </div>

          <div className="text-3xl font-extrabold text-green-950 font-mono tabular-nums">
            {totalCount}
          </div>

          <div className="text-[11px] text-gray-500 mt-1">
            All logged incidents across sector
          </div>
        </div>

        {/* Pending Alerts */}
        <div className="bg-white border border-red-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-red-700 text-xs font-medium mb-2">
            <span className="font-semibold">Pending Alerts</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          </div>

          <div className="text-3xl font-extrabold text-red-600 font-mono tabular-nums">
            {pendingCount}
          </div>

          <div className="text-[11px] text-red-600 mt-1">
            Immediate dispatch required
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 text-xs font-medium mb-2">
            <span className="font-semibold">In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>

          <div className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
            {inProgressCount}
          </div>

          <div className="text-[11px] text-amber-700 mt-1">
            {activeTeamsCount} rescue teams mobilized
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-green-700 text-xs font-medium mb-2">
            <span className="font-semibold">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-green-700" />
          </div>

          <div className="text-3xl font-extrabold text-green-700 font-mono tabular-nums">
            {resolvedCount}
          </div>

          <div className="text-[11px] text-green-700 mt-1">
            Secured & victims stabilized
          </div>
        </div>
      </div>

      {/* Live Geospatial Operations Map */}
      <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-green-950 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Live Emergency GIS Map (Alandi / North Pune)</span>
            </h2>

            <p className="text-xs text-gray-600 mt-0.5">
              Real-world OpenStreetMap and Satellite aerial layers with live address search, GPS positioning, and fleet vectors.
            </p>
          </div>

          <div className="text-xs text-gray-600 font-mono">
            Active Incidents: <span className="text-green-950 font-bold">{emergencies.length}</span>
            {' · '}
            Units: <span className="text-green-700 font-bold">{teams.length}</span>
          </div>
        </div>

        <EmergencyMap
          emergencies={emergencies}
          teams={teams}
          selectedId={selectedEmergencyId}
          onSelectEmergency={(id) => setSelectedEmergencyId(id)}
          heightClass="h-[520px]"
          showSearchBar={true}
          showLayerToggle={true}
        />
      </div>

      {/* Emergency Dispatch Table & Controls */}
      <div className="bg-white border border-green-200 rounded-2xl shadow-xl overflow-hidden">

        {/* Table Filter & Search Controls */}
        <div className="p-4 sm:p-5 border-b border-green-200 bg-green-50 flex flex-wrap items-center justify-between gap-4">

          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, victim name, location..."
              className="w-full bg-white border border-green-200 rounded-xl pl-9 pr-4 py-2 text-xs text-green-950 placeholder-gray-500 focus:outline-none focus:border-green-600"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5">

            {/* Status Select */}
            <div className="flex items-center gap-1.5 bg-white border border-green-200 rounded-xl px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-green-700" />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'All' | EmergencyStatus)}
                aria-label="Filter by Status"
                className="bg-transparent text-green-900 text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Type Select */}
            <div className="flex items-center gap-1.5 bg-white border border-green-200 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-gray-600 font-medium">Type:</span>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'All' | EmergencyType)}
                aria-label="Filter by Emergency Type"
                className="bg-transparent text-green-900 text-xs focus:outline-none cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Medical">Medical</option>
                <option value="Fire">Fire</option>
                <option value="Accident">Accident</option>
                <option value="Natural Disaster">Natural Disaster</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Download CSV Button */}
            <button
              type="button"
              onClick={downloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white border border-green-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Download incident table as CSV file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* The Dispatch Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="border-b border-green-200 bg-green-50 text-[11px] font-semibold uppercase tracking-wider text-green-800">
                <th className="py-3 px-4">Emergency ID</th>
                <th className="py-3 px-4">Victim Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Team</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-green-100 text-xs text-green-900">
              {filteredEmergencies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="font-semibold">No emergency incidents found</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Adjust your search query or status filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEmergencies.map((alert) => {
                  const isSelected = alert.id === selectedEmergencyId;

                  return (
                    <tr
                      key={alert.id}
                      className={`hover:bg-green-50 transition-colors ${
                        isSelected ? 'bg-green-100 border-l-2 border-green-700' : ''
                      }`}
                    >

                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-green-800">
                        {alert.id}
                      </td>

                      {/* Victim */}
                      <td className="py-3.5 px-4 font-semibold text-green-950">
                        <div>{alert.victimName}</div>

                        {alert.phone && (
                          <div className="text-[11px] font-mono text-gray-500">
                            {alert.phone}
                          </div>
                        )}
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-green-800">
                          {alert.type === 'Medical' && '🚑 Medical'}
                          {alert.type === 'Fire' && '🔥 Fire'}
                          {alert.type === 'Accident' && '⚠️ Accident'}
                          {alert.type === 'Natural Disaster' && '🌊 Disaster'}
                          {alert.type === 'Other' && '🚨 Hazard'}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="truncate text-green-800" title={alert.locationName}>
                          {alert.locationName}
                        </div>

                        <div className="text-[10px] text-gray-500 font-mono">
                          {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px] whitespace-nowrap">
                        {alert.timestamp.split(' ')[1] || alert.timestamp}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 font-bold text-[11px] px-2.5 py-0.5 rounded-full ${
                            alert.status === 'Pending'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : alert.status === 'In Progress'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-green-50 text-green-700 border border-green-200'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </td>

                      {/* Assigned Team */}
                      <td className="py-3.5 px-4">
                        {alert.assignedTeamName ? (
                          <span className="text-green-700 font-medium text-xs flex items-center gap-1">
                            <Users className="w-3 h-3 text-green-600" />
                            <span>{alert.assignedTeamName}</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedEmergencyId(alert.id)}
                            className="text-[11px] text-green-700 hover:text-green-950 underline decoration-green-300 hover:decoration-green-700 cursor-pointer"
                          >
                            + Assign Team
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">

                          {/* View Details */}
                          <button
                            onClick={() => setSelectedEmergencyId(alert.id)}
                            className="p-1.5 text-green-700 hover:text-green-950 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                            title="View Incident Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Mark In Progress */}
                          {alert.status === 'Pending' && (
                            <button
                              onClick={() => updateEmergencyStatus(alert.id, 'In Progress', 'Quick coordinator escalation')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Mark In Progress"
                            >
                              Dispatch
                            </button>
                          )}

                          {/* Quick Mark Resolved */}
                          {alert.status !== 'Resolved' && (
                            <button
                              onClick={() => setSelectedEmergencyId(alert.id)}
                              className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Review & Resolve"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Details Dossier Modal */}
      {selectedEmergencyId && (
        <EmergencyDetailsModal
          emergencyId={selectedEmergencyId}
          onClose={() => setSelectedEmergencyId(null)}
        />
      )}
    </div>
  );
};
