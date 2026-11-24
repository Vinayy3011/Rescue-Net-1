
import React, { useState, useEffect } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { ShieldAlert, Radio, Volume2, VolumeX, Clock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, audioEnabled, setAudioEnabled, emergencies } = useEmergency();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = emergencies.filter((e) => e.status === 'Pending').length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">

        {/* Logo */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 text-left text-lg font-extrabold tracking-tight text-green-900 whitespace-nowrap shrink-0 group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white shadow-md shadow-green-200 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-green-900">
            Rescue<span className="text-green-600 font-extrabold">-Net</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-green-800">

          <button
            onClick={() => setActiveTab('landing')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-green-600 cursor-pointer ${
              activeTab === 'landing' ? 'text-green-700 font-semibold underline underline-offset-8 decoration-green-600 decoration-2' : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('victim')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-red-600 cursor-pointer ${
              activeTab === 'victim' ? 'text-red-600 font-semibold underline underline-offset-8 decoration-red-500 decoration-2' : ''
            }`}
          >
            <span>Victim SOS</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-green-600 cursor-pointer ${
              activeTab === 'dashboard' ? 'text-green-700 font-semibold underline underline-offset-8 decoration-green-600 decoration-2' : ''
            }`}
          >
            <span>Coordinator Hub</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-red-100 text-red-600 border border-red-200 rounded">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-green-600 cursor-pointer ${
              activeTab === 'teams' ? 'text-green-700 font-semibold underline underline-offset-8 decoration-green-600 decoration-2' : ''
            }`}
          >
            Rescue Teams
          </button>

          <button
            onClick={() => setActiveTab('communication')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-green-600 cursor-pointer ${
              activeTab === 'communication' ? 'text-green-700 font-semibold underline underline-offset-8 decoration-green-600 decoration-2' : ''
            }`}
          >
            Data Architecture
          </button>

          <button
            onClick={() => setActiveTab('project')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-green-600 cursor-pointer ${
              activeTab === 'project' ? 'text-green-700 font-semibold underline underline-offset-8 decoration-green-600 decoration-2' : ''
            }`}
          >
            Project Dossier
          </button>
        </nav>

        {/* Clock, Audio and SOS Button */}
        <div className="flex items-center gap-3 shrink-0">

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono tabular-nums text-green-700 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-md">
            <Clock className="w-3.5 h-3.5 text-green-600" />
            <span>{timeStr || '21:52:41'}</span>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Siren tone enabled' : 'Siren tone muted'}
            aria-label="Toggle Alert Audio"
            className="p-1.5 text-green-700 hover:text-green-900 hover:bg-green-100 rounded-md transition-colors border border-green-200 cursor-pointer"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-green-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          {activeTab !== 'victim' ? (
            <button
              onClick={() => setActiveTab('victim')}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SEND SOS ALERT</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-green-700 hover:bg-green-800 border border-green-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Coordinator Hub
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center justify-around border-t border-green-200 px-2 py-2 text-xs bg-green-50 overflow-x-auto gap-2">

        <button
          onClick={() => setActiveTab('landing')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'landing' ? 'bg-green-700 text-white font-semibold' : 'text-green-800'}`}
        >
          Home
        </button>

        <button
          onClick={() => setActiveTab('victim')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'victim' ? 'bg-red-600 text-white font-bold' : 'text-red-600 font-semibold'}`}
        >
          SOS Alert
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-green-700 text-white font-semibold' : 'text-green-800'}`}
        >
          Dashboard ({pendingCount})
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'teams' ? 'bg-green-700 text-white font-semibold' : 'text-green-800'}`}
        >
          Teams
        </button>

        <button
          onClick={() => setActiveTab('communication')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'communication' ? 'bg-green-700 text-white font-semibold' : 'text-green-800'}`}
        >
          Data Comm
        </button>

        <button
          onClick={() => setActiveTab('project')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'project' ? 'bg-green-700 text-white font-semibold' : 'text-green-800'}`}
        >
          Info
        </button>
      </div>
    </header>
  );
};
