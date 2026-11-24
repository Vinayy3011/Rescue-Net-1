
import React from 'react';
import { useEmergency } from '../context/EmergencyContext';
import {
  ShieldAlert,
  Radio,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Zap,
  Users,
  CheckCircle2,
  Lock,
  ChevronRight,
  Server
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { emergencies, teams, setActiveTab } = useEmergency();

  const pendingCount = emergencies.filter((e) => e.status === 'Pending').length;
  const inProgressCount = emergencies.filter((e) => e.status === 'In Progress').length;
  const resolvedCount = emergencies.filter((e) => e.status === 'Resolved').length;

  return (
    <div className="space-y-20 pb-16 bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-4xl mx-auto space-y-6">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-xs text-green-800">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
            <span className="font-semibold">Next-Gen Incident Response & Tactical Coordination</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-green-950 leading-[1.1] max-w-3xl mx-auto text-balance">
            Every Second Matters.{' '}
            <span className="bg-gradient-to-r from-green-700 via-green-500 to-emerald-400 bg-clip-text text-transparent">
              Every Alert Counts.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Rescue-Net bridges citizens in acute distress with emergency command centers. Real-time GPS beaconing, sub-second WebSocket broadcast, and intelligent rescue fleet allocation for rapid life-saving action.
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">

            <button
              onClick={() => setActiveTab('victim')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-red-200 transition-all hover:scale-105 cursor-pointer beacon-active"
            >
              <Radio className="w-4 h-4 animate-spin" />
              <span>SEND SOS ALERT NOW</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold text-sm border border-green-800 transition-colors cursor-pointer"
            >
              <span>Coordinator Dashboard</span>
              <ChevronRight className="w-4 h-4 text-green-100" />
            </button>
          </div>

          {/* Real-time Sector Banner */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-green-600" />
              <span>Pilot Zone: Alandi & Northern Pune</span>
            </div>

            <div className="hidden sm:block text-green-300">·</div>

            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-green-600" />
              <span>Full-Duplex WebSocket Sync</span>
            </div>

            <div className="hidden sm:block text-green-300">·</div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>{teams.length} Specialized Rescue Units Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 shadow-lg">

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

            <div>
              <h2 className="text-lg font-bold text-green-950 tracking-tight">
                Live Incident Response Telemetry
              </h2>

              <p className="text-xs text-gray-600 mt-0.5">
                Real-time operational metrics across Alandi and Pune emergency sectors.
              </p>
            </div>

            <div className="text-xs font-mono text-green-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>SYSTEM ONLINE · 100% OPERATIONAL</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-white p-4 rounded-xl border border-green-200">
              <span className="text-xs font-medium text-gray-600 block mb-1">Total Incidents</span>
              <div className="text-3xl font-extrabold text-green-950 font-mono tabular-nums">
                {emergencies.length}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Logged in system</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-red-200">
              <span className="text-xs font-semibold text-red-600 block mb-1">Pending Alerts</span>
              <div className="text-3xl font-extrabold text-red-600 font-mono tabular-nums">
                {pendingCount}
              </div>
              <span className="text-[11px] text-red-500 mt-1 block">Awaiting responder allocation</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200">
              <span className="text-xs font-semibold text-amber-600 block mb-1">In Progress</span>
              <div className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
                {inProgressCount}
              </div>
              <span className="text-[11px] text-amber-500 mt-1 block">Units actively mobilized</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-green-200">
              <span className="text-xs font-semibold text-green-700 block mb-1">Resolved Safely</span>
              <div className="text-3xl font-extrabold text-green-700 font-mono tabular-nums">
                {resolvedCount}
              </div>
              <span className="text-[11px] text-green-600 mt-1 block">Victims secured</span>
            </div>

          </div>
        </div>
      </section>

      {/* How Rescue-Net Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-12">

          <span className="text-xs font-bold uppercase tracking-wider text-green-700">
            Rapid Response Workflow
          </span>

          <h2 className="text-3xl font-bold text-green-950 tracking-tight mt-1">
            How Rescue-Net Operates
          </h2>

          <p className="text-gray-600 text-sm mt-2">
            A seamless three-step data communication pipeline from citizen distress beacon to boots on the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Step 1 */}
          <div className="bg-white border border-green-200 rounded-2xl p-6 relative shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-base mb-4 border border-green-200">
              01
            </div>

            <h3 className="text-base font-bold text-green-950 mb-2">SOS Beacon Initiation</h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Victim accesses the lightweight web portal, grants one-click browser GPS permission, selects the emergency category, and hits Broadcast.
            </p>

            <div className="text-[11px] text-green-800 font-mono bg-green-50 p-2.5 rounded-lg border border-green-100">
              Payload: Lat/Lng + JSON Triage + Contact
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-green-200 rounded-2xl p-6 relative shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-base mb-4 border border-green-200">
              02
            </div>

            <h3 className="text-base font-bold text-green-950 mb-2">Sub-Second Network Broadcast</h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              FastAPI backend receives the REST packet on Port 8000 and fans out a WebSocket event to all connected coordinator monitoring consoles within 15 milliseconds.
            </p>

            <div className="text-[11px] text-green-800 font-mono bg-green-50 p-2.5 rounded-lg border border-green-100">
              Protocol: RFC 6455 Duplex WebSocket Frame
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-green-200 rounded-2xl p-6 relative shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold text-base mb-4 border border-green-200">
              03
            </div>

            <h3 className="text-base font-bold text-green-950 mb-2">Tactical Deployment</h3>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Coordinators visualize the incident on Leaflet GIS maps, allocate the nearest specialized rescue unit, and stream live status updates back to the victim.
            </p>

            <div className="text-[11px] text-green-800 font-mono bg-green-50 p-2.5 rounded-lg border border-green-100">
              Output: Unit Dispatch + Victim ETA Lock
            </div>
          </div>

        </div>
      </section>

      {/* Features & Technical Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="bg-green-50 border border-green-200 rounded-3xl p-8 sm:p-12">

          <div className="max-w-3xl mb-10">

            <span className="text-xs font-bold uppercase tracking-wider text-green-700">
              Platform Capabilities
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-green-950 tracking-tight mt-1">
              Engineered for Critical Reliability
            </h2>

            <p className="text-gray-600 text-sm mt-2">
              Combining resilient data transmission protocols with intuitive triage management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mb-2">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-green-950">Geospatial Leaflet GIS</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Color-coded map beacons render precise incident positions, nearby hospital access, and responder location vectors.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-green-950">Sub-Second Latency</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Persistent WebSocket connection removes HTTP roundtrip polling overhead, keeping network latency below 20ms.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-green-950">Fleet & Roster Allocation</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Track readiness, gear manifests, and radio channels for Fire, Medical Trauma, Tactical, and Water Rescue teams.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-green-950">Audit & Timeline Tracking</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every action, status update, and note is preserved in an immutable chronologically ordered incident log.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-green-950">OSI Packet Inspector</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Built-in educational diagnostic view displaying socket port binds, TCP/IP handshakes, and raw JSON byte frames.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center mb-2">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-green-950">Safe Resolution Guard</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Two-step confirmation prevents accidental emergency closure and automatically frees dispatched units back to base.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-200 bg-green-50 pt-12 pb-8 px-4 sm:px-6">

        <div className="max-w-7xl mx-auto space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            <div className="md:col-span-2 space-y-3">

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-700 flex items-center justify-center text-white">
                  <ShieldAlert className="w-4 h-4" />
                </div>

                <span className="text-lg font-bold text-green-950">
                  Rescue<span className="text-green-600">-Net</span>
                </span>
              </div>

              <p className="text-xs text-gray-600 max-w-md leading-relaxed">
                Emergency Communication & Coordination Platform designed for real-time SOS broadcasting, geospatial routing, and emergency triage management.
              </p>
            </div>

            <div className="space-y-2 text-xs">

              <span className="font-bold uppercase tracking-wider text-green-900 block">
                Academic Project Credentials
              </span>

              <div className="text-gray-600 space-y-1">
                <span className="text-gray-500 block text-[11px]">Project Developers:</span>

                <div className="space-y-0.5">
                  <div><strong className="text-green-950">Pranjal Shelke</strong> <span className="font-mono text-[11px] text-gray-500">(Roll 61)</span></div>
                  <div><strong className="text-green-950">Vinay Kale</strong> <span className="font-mono text-[11px] text-gray-500">(Roll 65)</span></div>
                  <div><strong className="text-green-950">Tina Savkare</strong> <span className="font-mono text-[11px] text-gray-500">(Roll 67)</span></div>
                  <div><strong className="text-green-950">Vivek Choursiya</strong> <span className="font-mono text-[11px] text-gray-500">(Roll 68)</span></div>
                </div>
              </div>

              <p className="text-gray-600 pt-1">
                <span className="text-gray-500">Project Guide:</span>{' '}
                <strong className="text-green-950">Mr. Shivaji Patil</strong>
              </p>

              <p className="text-gray-600">
                <span className="text-gray-500">Department:</span> Information Technology
              </p>

              <p className="text-gray-600">
                <span className="text-gray-500">Domain:</span> Data Communication
              </p>
            </div>

            <div className="space-y-2 text-xs">

              <span className="font-bold uppercase tracking-wider text-green-900 block">
                Platform Navigation
              </span>

              <ul className="space-y-1.5 text-gray-600">

                <li>
                  <button onClick={() => setActiveTab('victim')} className="hover:text-green-700 transition-colors cursor-pointer">
                    Victim SOS Broadcast
                  </button>
                </li>

                <li>
                  <button onClick={() => setActiveTab('dashboard')} className="hover:text-green-700 transition-colors cursor-pointer">
                    Coordinator Hub & GIS Map
                  </button>
                </li>

                <li>
                  <button onClick={() => setActiveTab('teams')} className="hover:text-green-700 transition-colors cursor-pointer">
                    Rescue Team Management
                  </button>
                </li>

                <li>
                  <button onClick={() => setActiveTab('communication')} className="hover:text-green-700 transition-colors cursor-pointer">
                    Data Communication Specs
                  </button>
                </li>

              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-green-200 flex flex-wrap items-center justify-between text-xs text-gray-600">

            <div>
              © 2026 Rescue-Net · Emergency Communication and Coordination Platform
            </div>

            <div className="font-mono text-[11px]">
              Alandi & Pune Demonstration Build
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
};
