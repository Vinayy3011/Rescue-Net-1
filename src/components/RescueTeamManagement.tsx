
import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import {
  Shield,
  Radio,
} from 'lucide-react';

export const RescueTeamManagement: React.FC = () => {
  const {
    teams,
    emergencies,
    assignTeamToEmergency,
    setSelectedEmergencyId,
    setActiveTab
  } = useEmergency();

  const [assignmentModalTeamId, setAssignmentModalTeamId] = useState<string | null>(null);
  const [targetEmergencyId, setTargetEmergencyId] = useState<string>('');

  const pendingEmergencies = emergencies.filter(
    (e) => e.status === 'Pending' || e.status === 'In Progress'
  );

  const handleQuickAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentModalTeamId || !targetEmergencyId) return;

    assignTeamToEmergency(targetEmergencyId, assignmentModalTeamId);
    setAssignmentModalTeamId(null);
    setTargetEmergencyId('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Tactical Operations · Rescue Fleet Dispatch</span>
          </div>

          <h1 className="text-3xl font-extrabold text-green-950 tracking-tight">
            Rescue Team Management
          </h1>

          <p className="text-gray-600 text-sm mt-1 max-w-2xl">
            Monitor emergency response units, team readiness, specialized apparatus, and assign active units to high-priority distress alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-700 bg-white border border-green-200 px-3 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">
                Total Fleet
              </span>
              <span className="text-sm font-bold text-green-950 font-mono">
                {teams.length} Teams
              </span>
            </div>

            <div className="h-6 w-px bg-green-200"></div>

            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold">
                Available
              </span>
              <span className="text-sm font-bold text-green-700 font-mono">
                {teams.filter((t) => t.status === 'Available').length} Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Rescue Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const assignedEmergency = emergencies.find(
            (e) => e.id === team.currentEmergencyId
          );

          return (
            <div
              key={team.id}
              className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-green-500 hover:shadow-md transition-all"
            >
              <div>

                {/* Top Badge & Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-green-700 font-bold block">
                      {team.specialization}
                    </span>

                    <h3 className="text-lg font-bold text-green-950 mt-0.5">
                      {team.name}
                    </h3>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      team.status === 'Available'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : team.status === 'Dispatched'
                        ? 'bg-amber-100 text-amber-700 border border-amber-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    ● {team.status}
                  </span>
                </div>

                {/* Team Lead & Base Location */}
                <div className="space-y-2 text-xs text-gray-700 py-3 border-y border-green-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Unit Commander:</span>
                    <span className="font-semibold text-gray-900">
                      {team.lead}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Active Crew:</span>
                    <span className="font-mono text-gray-900">
                      {team.membersCount} Certified Rescuers
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Base Depot:</span>
                    <span
                      className="text-gray-700 truncate max-w-[180px] text-right"
                      title={team.baseLocation}
                    >
                      {team.baseLocation}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Comms:</span>
                    <span className="font-mono text-[11px] text-green-700">
                      {team.contact}
                    </span>
                  </div>
                </div>

                {/* Team Members Roster */}
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-gray-600 block mb-1">
                    Crew Manifest:
                  </span>

                  <div className="flex flex-wrap gap-1">
                    {team.members.map((member, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-green-50 text-green-900 border border-green-200 px-2 py-0.5 rounded"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-gray-600 block mb-1">
                    Key Equipment:
                  </span>

                  <ul className="text-[11px] text-gray-600 space-y-0.5">
                    {team.equipment.slice(0, 3).map((eq, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="w-1 h-1 rounded-full bg-green-600"></span>
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Currently Assigned Emergency */}
                {assignedEmergency && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-800 font-bold text-[11px]">
                      <span>CURRENTLY DISPATCHED</span>
                      <span className="font-mono">{assignedEmergency.id}</span>
                    </div>

                    <div className="text-gray-900 font-semibold truncate">
                      {assignedEmergency.victimName} · {assignedEmergency.type}
                    </div>

                    <div className="text-[11px] text-gray-600 truncate">
                      {assignedEmergency.locationName}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEmergencyId(assignedEmergency.id);
                        setActiveTab('dashboard');
                      }}
                      className="text-[11px] text-amber-700 hover:underline pt-1 block cursor-pointer"
                    >
                      View Incident in Dashboard →
                    </button>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-green-100">
                {team.status === 'Available' ? (
                  <button
                    onClick={() => setAssignmentModalTeamId(team.id)}
                    className="w-full py-2 px-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Deploy to Active Incident</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-gray-500 py-1 font-mono">
                    Unit engaged on mission
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deployment Modal */}
      {assignmentModalTeamId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-green-950/60 backdrop-blur-sm">
          <div className="bg-white border border-green-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-green-950 mb-1">
              Deploy Unit: {teams.find((t) => t.id === assignmentModalTeamId)?.name}
            </h3>

            <p className="text-xs text-gray-600 mb-4">
              Select an ongoing emergency to allocate this team immediately.
            </p>

            <form onSubmit={handleQuickAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Incident
                </label>

                <select
                  required
                  value={targetEmergencyId}
                  onChange={(e) => setTargetEmergencyId(e.target.value)}
                  className="w-full bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-green-600"
                >
                  <option value="">
                    Select incident needing assistance...
                  </option>

                  {pendingEmergencies.map((em) => (
                    <option key={em.id} value={em.id}>
                      [{em.id}] {em.type} - {em.victimName} ({em.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAssignmentModalTeamId(null);
                    setTargetEmergencyId('');
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!targetEmergencyId}
                  className="px-4 py-1.5 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
