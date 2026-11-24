
import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { EmergencyType } from '../types/emergency';
import { EmergencyMap } from './EmergencyMap';
import {
  MapPin,
  Crosshair,
  AlertTriangle,
  Phone,
  User,
  Radio,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const VictimSosView: React.FC = () => {
  const { addEmergency, lastSubmittedAlert, setActiveTab, setSelectedEmergencyId } = useEmergency();

  // Form states
  const [victimName, setVictimName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyType, setEmergencyType] = useState<EmergencyType>('Medical');
  const [message, setMessage] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number>(18.6750);
  const [longitude, setLongitude] = useState<number>(73.8965);

  // GPS states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  // Submission states
  const [submittedAlertId, setSubmittedAlertId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Request browser geolocation ONLY upon user click
  const handleGetLocation = () => {
    setGpsLoading(true);
    setGpsError(null);
    setGpsSuccess(false);

    if (!('geolocation' in navigator)) {
      setGpsError('Browser does not support Geolocation API. Please enter your location manually.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setGpsSuccess(true);
        setGpsLoading(false);
        if (!locationName) {
          setLocationName(`GPS Fixed Location (±${Math.round(position.coords.accuracy)}m accuracy)`);
        }
      },
      (error) => {
        setGpsLoading(false);
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied by browser. Please type your location manually below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information unavailable. Please select your location on the map or type it manually.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please enter manually.';
        }
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleMapLocationSelect = (lat: number, lng: number, address?: string) => {
    setLatitude(parseFloat(lat.toFixed(6)));
    setLongitude(parseFloat(lng.toFixed(6)));
    setGpsSuccess(true);
    if (address) {
      setLocationName(address);
    } else if (!locationName || locationName.startsWith('GPS Fixed') || locationName.startsWith('Custom Pin')) {
      setLocationName(`Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  const handlePresetLocation = (name: string, lat: number, lng: number) => {
    setLocationName(name);
    setLatitude(lat);
    setLongitude(lng);
    setGpsSuccess(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!victimName.trim()) {
      setValidationError('Please enter your full name so rescuers can identify you.');
      return;
    }

    if (!message.trim()) {
      setValidationError('Please provide a brief description of the emergency.');
      return;
    }

    if (!locationName.trim()) {
      setValidationError('Please provide your approximate location or landmark.');
      return;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      setValidationError('Valid latitude and longitude coordinates are required for emergency dispatch.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const alert = addEmergency({
        victimName: victimName.trim(),
        phone: phone.trim() || 'Not specified',
        type: emergencyType,
        message: message.trim(),
        locationName: locationName.trim(),
        latitude,
        longitude,
        priority: emergencyType === 'Medical' || emergencyType === 'Fire' ? 'Critical' : 'High'
      });

      setSubmittedAlertId(alert.id);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Title & Mode Banner */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Victim Emergency Mode · Urgent Response Channel</span>
            </div>
            <h1 className="text-3xl font-extrabold text-green-950 tracking-tight">
              Emergency SOS Transmission
            </h1>
            <p className="text-gray-600 text-sm mt-1 max-w-2xl">
              Fill in your distress details. Your GPS coordinates and alert will be packet-streamed immediately to the centralized Coordinator Control Center and nearest rescue units.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-green-800 bg-white hover:bg-green-100 border border-green-200 rounded-lg transition-colors cursor-pointer"
            >
              <span>Go to Coordinator Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Emergency SOS Form */}
        <div className="lg:col-span-7 bg-white border border-green-200 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"></div>

          {validationError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Incomplete Form</p>
                <p className="text-xs text-red-700 mt-0.5">{validationError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Victim Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-green-800 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={victimName}
                    onChange={(e) => setVictimName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-green-50 border border-green-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-green-950 placeholder-gray-500 focus:outline-none focus:border-green-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-green-800 mb-2">
                  Contact Number <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98220 12345"
                    className="w-full bg-green-50 border border-green-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-green-950 placeholder-gray-500 focus:outline-none focus:border-green-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Type Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-green-800 mb-2">
                Emergency Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { type: 'Medical' as EmergencyType, icon: '🚑', label: 'Medical' },
                  { type: 'Fire' as EmergencyType, icon: '🔥', label: 'Fire' },
                  { type: 'Accident' as EmergencyType, icon: '⚠️', label: 'Accident' },
                  { type: 'Natural Disaster' as EmergencyType, icon: '🌊', label: 'Natural Disaster' },
                  { type: 'Other' as EmergencyType, icon: '🚨', label: 'Other Hazard' }
                ].map((item) => {
                  const isSelected = emergencyType === item.type;
                  return (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setEmergencyType(item.type)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-50 border-red-500 text-red-700 shadow-sm shadow-red-100'
                          : 'bg-green-50 border-green-200 text-green-800 hover:border-green-300 hover:text-green-950'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency Message */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-green-800 mb-2">
                Emergency Situation Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what is happening and any immediate risks."
                className="w-full bg-green-50 border border-green-300 rounded-xl p-3 text-sm text-green-950 placeholder-gray-500 focus:outline-none focus:border-green-600 transition-colors"
              />
            </div>

            {/* Location Section */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-green-950 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Location & Coordinates</span>
                  </h3>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Click GPS to pinpoint your device, or drag the marker on the map.
                  </p>
                </div>

                {/* GPS Trigger Button */}
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gpsLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-100 hover:bg-green-200 border border-green-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin' : ''}`} />
                  <span>{gpsLoading ? 'Locking Satellite...' : 'Get Current GPS'}</span>
                </button>
              </div>

              {gpsError && (
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{gpsError}</span>
                </div>
              )}

              {gpsSuccess && (
                <div className="text-xs text-green-800 bg-green-50 border border-green-200 p-2 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                  <span>Coordinates synchronized: [{latitude.toFixed(5)}, {longitude.toFixed(5)}]</span>
                </div>
              )}

              {/* Landmark name */}
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Location / Address / Landmark
                </label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Near Indrayani River Ghat, Alandi / Pune Road"
                  className="w-full bg-white border border-green-300 rounded-lg px-3 py-2 text-xs text-green-950 placeholder-gray-500 focus:outline-none focus:border-green-600"
                />
              </div>

              {/* Lat & Lng Input row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-green-300 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-green-950 focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-green-300 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-green-950 focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons for College Demo */}
              <div>
                <span className="text-[11px] text-gray-600 block mb-1.5 font-medium">
                  Quick Demo Locations (Alandi & Pune Sector):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetLocation('MIT AOE Campus, Alandi', 18.6763, 73.8951)}
                    className="px-2 py-1 text-[11px] bg-white hover:bg-green-100 text-green-800 border border-green-200 rounded cursor-pointer"
                  >
                    MIT AOE Alandi
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetLocation('Indrayani River Ghat, Alandi', 18.6788, 73.8992)}
                    className="px-2 py-1 text-[11px] bg-white hover:bg-green-100 text-green-800 border border-green-200 rounded cursor-pointer"
                  >
                    Indrayani Ghat
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetLocation('Moshi Toll Plaza Junction', 18.6675, 73.8640)}
                    className="px-2 py-1 text-[11px] bg-white hover:bg-green-100 text-green-800 border border-green-200 rounded cursor-pointer"
                  >
                    Moshi Toll Chowk
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetLocation('Dighi Hills, Pune', 18.6186, 73.8732)}
                    className="px-2 py-1 text-[11px] bg-white hover:bg-green-100 text-green-800 border border-green-200 rounded cursor-pointer"
                  >
                    Dighi Sector
                  </button>
                </div>
              </div>
            </div>

            {/* Giant Broadcast SOS Alert Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.99] text-white font-extrabold text-base tracking-wider uppercase transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 cursor-pointer beacon-active disabled:opacity-60"
              >
                <Radio className="w-5 h-5 animate-spin" />
                <span>{isSubmitting ? 'ENCODING & TRANSMITTING SOS...' : 'BROADCAST SOS ALERT'}</span>
                <Send className="w-4 h-4 ml-1" />
              </button>
              <p className="text-[11px] text-center text-gray-600 mt-2 font-mono">
                TCP Packet will transmit to FastAPI Dispatch Server [Port 8000] via WebSocket broadcast.
              </p>
            </div>
          </form>
        </div>

        {/* Right Column: Location Map Preview & Active Alert Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Mini-Map Preview */}
          <div className="bg-white border border-green-200 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-green-950 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Geospatial Pinpoint</span>
              </h2>
              <span className="text-[11px] text-gray-600 font-mono">
                Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
              </span>
            </div>

            <EmergencyMap
              interactiveSelect={true}
              center={[latitude, longitude]}
              zoom={14}
              onLocationSelect={handleMapLocationSelect}
              heightClass="h-[340px]"
              showSearchBar={true}
              showLayerToggle={true}
            />
            <p className="text-[11px] text-gray-600 mt-2 flex items-center justify-between">
              <span>Tip: Click anywhere or search to lock coordinates & address automatically.</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline"
              >
                Google Maps ↗
              </a>
            </p>
          </div>

          {/* Victim Active Tracking Card */}
          {submittedAlertId || lastSubmittedAlert ? (
            <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-700" />
                  <h3 className="text-sm font-bold text-green-950">Live SOS Status Dossier</h3>
                </div>
                <span className="text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  {lastSubmittedAlert?.id || submittedAlertId}
                </span>
              </div>

              <div className="space-y-4">
                {/* Status indicator */}
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-600 block">
                      Current Status
                    </span>
                    <span
                      className={`text-sm font-extrabold ${
                        lastSubmittedAlert?.status === 'Pending'
                          ? 'text-red-600'
                          : lastSubmittedAlert?.status === 'In Progress'
                          ? 'text-amber-600'
                          : 'text-green-700'
                      }`}
                    >
                      ● {lastSubmittedAlert?.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-600 block">
                      Assigned Team
                    </span>
                    <span className="text-xs font-bold text-green-900">
                      {lastSubmittedAlert?.assignedTeamName || 'Queued for Dispatch'}
                    </span>
                  </div>
                </div>

                {/* Victim Details Recap */}
                <div className="text-xs space-y-1.5 text-green-800">
                  <p>
                    <span className="text-gray-500">Victim:</span>{' '}
                    <strong className="text-green-950">{lastSubmittedAlert?.victimName}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Emergency:</span>{' '}
                    <span className="font-semibold text-red-700">{lastSubmittedAlert?.type}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Location:</span>{' '}
                    <span className="text-green-800">{lastSubmittedAlert?.locationName}</span>
                  </p>
                  <p className="text-[11px] text-gray-700 italic bg-green-50 p-2 rounded border border-green-200">
                    "{lastSubmittedAlert?.message}"
                  </p>
                </div>

                {/* Recent Status History Timeline */}
                <div className="pt-2 border-t border-green-200">
                  <span className="text-[11px] font-bold text-gray-600 block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Real-Time Audit Trail</span>
                  </span>
                  <div className="space-y-2 max-h-36 overflow-y-auto text-xs pr-1">
                    {lastSubmittedAlert?.history.map((h, i) => (
                      <div key={i} className="bg-green-50 p-2 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1 font-mono">
                          <span>{h.author}</span>
                          <span>{h.timestamp.split(' ')[1] || h.timestamp}</span>
                        </div>
                        <p className="text-green-900 text-[11px]">{h.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View on Coordinator Dashboard */}
                <button
                  type="button"
                  onClick={() => {
                    if (lastSubmittedAlert) {
                      setSelectedEmergencyId(lastSubmittedAlert.id);
                    }
                    setActiveTab('dashboard');
                  }}
                  className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-semibold border border-green-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Track Live on Coordinator Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-xl text-center">
              <ShieldCheck className="w-10 h-10 text-gray-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-green-900">No Active Distress Signal</h3>
              <p className="text-xs text-gray-600 mt-1">
                Fill the form on the left to transmit your live SOS beacon. Your emergency will appear here with instant tracking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
