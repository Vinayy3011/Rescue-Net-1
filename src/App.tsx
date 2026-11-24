
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { VictimSosView } from './components/VictimSosView';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { RescueTeamManagement } from './components/RescueTeamManagement';
import { DataCommunicationView } from './components/DataCommunicationView';
import { ProjectInfoView } from './components/ProjectInfoView';
import { ArrowRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    emergencies,
    setSelectedEmergencyId
  } = useEmergency();

  const latestPending = emergencies.find(
    (e) => e.status === 'Pending'
  );

  return (
    <div className="min-h-screen bg-green-50 text-green-950 flex flex-col font-sans selection:bg-green-700 selection:text-white">

      {/* Top Navigation */}
      <Navbar />

      {/* Real-time Distress Notification Banner */}
      {latestPending &&
        activeTab !== 'dashboard' &&
        activeTab !== 'victim' && (
          <aside
            aria-label="Emergency notification"
            className="bg-red-50 border-b border-red-200 py-2.5 px-4 text-xs"
          >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>

                <span className="font-bold text-red-700">
                  ACTIVE SOS ALERT:
                </span>

                <span className="text-red-950 font-semibold">
                  [{latestPending.id}] {latestPending.victimName} (
                  {latestPending.type} - {latestPending.locationName})
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedEmergencyId(latestPending.id);
                  setActiveTab('dashboard');
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Dispatch on Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </aside>
        )}

      {/* Main View Area */}
      <main className="flex-1 bg-green-50">

        {activeTab === 'landing' && <LandingPage />}

        {activeTab === 'victim' && <VictimSosView />}

        {activeTab === 'dashboard' && <CoordinatorDashboard />}

        {activeTab === 'teams' && <RescueTeamManagement />}

        {activeTab === 'communication' && <DataCommunicationView />}

        {activeTab === 'project' && <ProjectInfoView />}

      </main>
    </div>
  );
};

export default function App() {
  return (
    <EmergencyProvider>
      <AppContent />
    </EmergencyProvider>
  );
}
