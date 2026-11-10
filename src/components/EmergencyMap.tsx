import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EmergencyAlert, RescueTeam } from '../types/emergency';
import {
  Layers,
  Search,
  Crosshair,
  Maximize2,
  Minimize2,
  Compass,
  MapPin,
  Check,
  Loader2,
  X
} from 'lucide-react';

export type MapTileTheme = 'streets' | 'satellite' | 'hybrid' | 'terrain' | 'dark';

interface EmergencyMapProps {
  emergencies?: EmergencyAlert[];
  teams?: RescueTeam[];
  selectedId?: string | null;
  onSelectEmergency?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  interactiveSelect?: boolean;
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  heightClass?: string;
  showSearchBar?: boolean;
  showLayerToggle?: boolean;
}

export const EmergencyMap: React.FC<EmergencyMapProps> = ({
  emergencies = [],
  teams = [],
  selectedId,
  onSelectEmergency,
  center = [18.6750, 73.8900], // Default center around Alandi & North Pune
  zoom = 13,
  interactiveSelect = false,
  onLocationSelect,
  heightClass = 'h-[480px]',
  showSearchBar = true,
  showLayerToggle = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userPinRef = useRef<L.Marker | null>(null);
  const userGpsCircleRef = useRef<L.Circle | null>(null);

  // Map state
  const [currentTheme, setCurrentTheme] = useState<MapTileTheme>('streets');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Tile layer configurations
  const getTileConfig = (theme: MapTileTheme) => {
    switch (theme) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS',
          maxZoom: 19
        };
      case 'hybrid':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Imagery &copy; Esri &bull; Labels &copy; OpenStreetMap',
          maxZoom: 19,
          labelsUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png'
        };
      case 'terrain':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM &bull; Map style: &copy; OpenTopoMap',
          maxZoom: 17
        };
      case 'dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 19
        };
      case 'streets':
      default:
        return {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        };
    }
  };

  // Reverse Geocoding via Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }
    } catch {
      // Fallback to coordinates
    }
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false, // Custom zoom control positioned cleanly
      attributionControl: true
    });

    // Add scale indicator (meters & km)
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // Initial base tile layer
    const config = getTileConfig('streets');
    const tileLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      attribution: config.attribution
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Handle map clicks for victim location selection
    if (interactiveSelect && onLocationSelect) {
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const address = await reverseGeocode(lat, lng);
        onLocationSelect(lat, lng, address);
      });
    }

    // Force tile recalculation once container is painted
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Resize observer to ensure the map always sizes cleanly inside tabs/cards
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer Theme
  const switchTheme = useCallback((theme: MapTileTheme) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    if (labelLayerRef.current) {
      map.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }

    const config = getTileConfig(theme);
    const newTile = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      attribution: config.attribution
    }).addTo(map);
    tileLayerRef.current = newTile;

    if (config.labelsUrl) {
      const labels = L.tileLayer(config.labelsUrl, {
        maxZoom: config.maxZoom,
        pane: 'overlayPane'
      }).addTo(map);
      labelLayerRef.current = labels;
    }

    setCurrentTheme(theme);
  }, []);

  // Update center when changed from parent
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (center && (!emergencies.length || interactiveSelect)) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, interactiveSelect]);

  // Render Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const createMarkerIcon = (status: string, type: string, isSelected: boolean) => {
      let bg = '#ef4444'; // Red for Pending
      let pulse = 'beacon-active';
      if (status === 'In Progress') {
        bg = '#f59e0b'; // Amber
        pulse = '';
      } else if (status === 'Resolved') {
        bg = '#10b981'; // Green
        pulse = '';
      }

      const ring = isSelected ? 'ring-4 ring-white shadow-2xl scale-125 z-50' : 'ring-2 ring-slate-900 shadow-md';

      return L.divIcon({
        className: 'custom-emergency-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${pulse} ${ring}" style="background-color: ${bg}; transition: transform 0.2s;">
              ${type === 'Medical' ? '🚑' : type === 'Fire' ? '🔥' : type === 'Accident' ? '⚠️' : type === 'Natural Disaster' ? '🌊' : '🚨'}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    };

    const createTeamIcon = (teamName: string) => {
      return L.divIcon({
        className: 'custom-team-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="w-7 h-7 rounded-md bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-lg text-[10px] font-bold">
              🛡️
            </div>
            <div class="absolute -bottom-4 text-[9px] bg-slate-900/90 text-blue-200 px-1 rounded whitespace-nowrap border border-blue-500/30 font-mono">
              ${teamName.split(' ').slice(-1)[0]}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });
    };

    // Plot Emergencies
    emergencies.forEach((alert) => {
      if (!alert.latitude || !alert.longitude) return;

      const isSelected = alert.id === selectedId;
      const icon = createMarkerIcon(alert.status, alert.type, isSelected);
      const marker = L.marker([alert.latitude, alert.longitude], { icon });

      const statusBadge =
        alert.status === 'Pending'
          ? '<span style="color:#ef4444;font-weight:700;">● PENDING RESCUE</span>'
          : alert.status === 'In Progress'
          ? '<span style="color:#f59e0b;font-weight:700;">● IN PROGRESS</span>'
          : '<span style="color:#10b981;font-weight:700;">● RESOLVED</span>';

      const popupHtml = `
        <div style="min-width: 220px; font-family: inherit;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:11px;">
            <span style="font-family:monospace; color:#94a3b8; font-weight:600;">${alert.id}</span>
            ${statusBadge}
          </div>
          <div style="font-weight:700; font-size:14px; color:#f8fafc; margin-bottom:3px;">
            ${alert.victimName}
          </div>
          <div style="font-size:12px; color:#cbd5e1; margin-bottom:6px; line-height:1.3;">
            ${alert.type} Emergency · <span style="color:#94a3b8;">${alert.locationName}</span>
          </div>
          <div style="font-size:11px; color:#94a3b8; background:#1e293b; padding:6px; border-radius:4px; margin-bottom:8px; border:1px solid #334155;">
            "${alert.message.slice(0, 90)}${alert.message.length > 90 ? '...' : ''}"
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#94a3b8;">
            <span>${alert.timestamp.split(' ')[1] || alert.timestamp}</span>
            <button id="btn-popup-${alert.id}" style="background:#dc2626; color:#ffffff; border:none; padding:4px 9px; border-radius:4px; font-weight:600; cursor:pointer;">
              View Dossier
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectEmergency) {
          onSelectEmergency(alert.id);
        }
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${alert.id}`);
        if (btn && onSelectEmergency) {
          btn.onclick = () => onSelectEmergency(alert.id);
        }
      });

      marker.addTo(markersLayer);
    });

    // Plot Rescue Teams
    teams.forEach((team) => {
      if (!team.coordinates) return;
      const icon = createTeamIcon(team.name);
      const marker = L.marker(team.coordinates, { icon });

      const popupHtml = `
        <div style="min-width: 190px;">
          <div style="font-size:11px; color:#60a5fa; font-weight:700; text-transform:uppercase;">Rescue Unit</div>
          <div style="font-weight:700; font-size:13px; color:#f8fafc;">${team.name}</div>
          <div style="font-size:11px; color:#94a3b8; margin-top:2px;">Lead: ${team.lead}</div>
          <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">Status: <b style="color:${team.status === 'Available' ? '#10b981' : '#f59e0b'}">${team.status}</b></div>
          <div style="font-size:10px; color:#64748b; margin-top:4px; font-family:monospace;">${team.contact}</div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      marker.addTo(markersLayer);
    });

    // Auto-focus selected alert
    if (selectedId) {
      const selected = emergencies.find((e) => e.id === selectedId);
      if (selected) {
        map.setView([selected.latitude, selected.longitude], 15, { animate: true });
      }
    }
  }, [emergencies, teams, selectedId, onSelectEmergency]);

  // Interactive Victim SOS Pin & Dragging
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !interactiveSelect) return;

    if (userPinRef.current) {
      userPinRef.current.remove();
    }

    if (center && center[0] && center[1]) {
      const pinIcon = L.divIcon({
        className: 'user-sos-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-red-600 border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold text-base beacon-active">
              📍
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const pin = L.marker(center, {
        icon: pinIcon,
        draggable: true
      }).addTo(map);

      pin.on('dragend', async () => {
        const pos = pin.getLatLng();
        const address = await reverseGeocode(pos.lat, pos.lng);
        if (onLocationSelect) {
          onLocationSelect(pos.lat, pos.lng, address);
        }
      });

      userPinRef.current = pin;
    }
  }, [center, interactiveSelect, onLocationSelect]);

  // Handle Location Search via Nominatim API
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error('Map search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (res: { lat: string; lon: string; display_name: string }) => {
    const lat = parseFloat(res.lat);
    const lng = parseFloat(res.lon);
    const map = mapInstanceRef.current;

    if (map) {
      map.flyTo([lat, lng], 15, { duration: 1.5 });
    }

    if (interactiveSelect && onLocationSelect) {
      onLocationSelect(lat, lng, res.display_name);
    }

    setShowDropdown(false);
    setSearchQuery(res.display_name.split(',')[0]);
  };

  // Locate User Device GPS
  const handleLocateMe = () => {
    setIsLocating(true);
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        const map = mapInstanceRef.current;

        if (map) {
          map.flyTo([lat, lng], 16, { duration: 1.5 });

          // Draw GPS accuracy circle
          if (userGpsCircleRef.current) {
            userGpsCircleRef.current.remove();
          }

          const circle = L.circle([lat, lng], {
            radius: accuracy,
            color: '#3b82f6',
            fillColor: '#60a5fa',
            fillOpacity: 0.15,
            weight: 1.5
          }).addTo(map);

          userGpsCircleRef.current = circle;
        }

        if (interactiveSelect && onLocationSelect) {
          const address = await reverseGeocode(lat, lng);
          onLocationSelect(lat, lng, address);
        }

        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        alert(`Location acquisition failed: ${err.message}. Please select your location on the map.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Reset to All Incidents
  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (emergencies.length > 0) {
      const bounds = L.latLngBounds([]);
      emergencies.forEach((e) => {
        if (e.latitude && e.longitude) bounds.extend([e.latitude, e.longitude]);
      });
      teams.forEach((t) => {
        if (t.coordinates) bounds.extend(t.coordinates);
      });
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
        return;
      }
    }
    map.setView([18.6750, 73.8900], 13);
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : heightClass
      }`}
    >
      {/* Map DOM viewport */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Map Toolbar: Real Search & Layer Switcher */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Real Address Search Input */}
        {showSearchBar && (
          <div className="relative pointer-events-auto max-w-xs sm:max-w-sm w-full">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search real location (Alandi, Pune, road...)"
                className="w-full bg-slate-950/95 backdrop-blur-md border border-slate-700/90 text-white rounded-xl pl-9 pr-8 py-2 text-xs shadow-xl placeholder-slate-400 focus:outline-none focus:border-red-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="absolute right-2.5 p-0.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Dropdown search results */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left p-2.5 text-xs text-slate-200 hover:bg-slate-800/90 border-b border-slate-800 last:border-0 flex items-start gap-2 cursor-pointer transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Real Layer Switcher Buttons */}
        {showLayerToggle && (
          <div className="flex items-center gap-1 p-1 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-xl pointer-events-auto text-xs">
            <button
              type="button"
              onClick={() => switchTheme('streets')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                currentTheme === 'streets' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
              title="Real OpenStreetMap Street Layer"
            >
              <span>🗺️ Street</span>
            </button>
            <button
              type="button"
              onClick={() => switchTheme('satellite')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                currentTheme === 'satellite' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
              title="Real Satellite Aerial Photography"
            >
              <span>🛰️ Satellite</span>
            </button>
            <button
              type="button"
              onClick={() => switchTheme('hybrid')}
              className={`hidden sm:flex px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer items-center gap-1 ${
                currentTheme === 'hybrid' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
              title="Satellite with Road Names Overlay"
            >
              <span>🌐 Hybrid</span>
            </button>
            <button
              type="button"
              onClick={() => switchTheme('dark')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                currentTheme === 'dark' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
              title="Night Ops Tactical Map"
            >
              <span>🌙 Night</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Controls on Right */}
      <div className="absolute right-3 top-16 z-[400] flex flex-col gap-2 pointer-events-auto">
        {/* Locate Me (GPS) */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="p-2.5 bg-slate-950/95 hover:bg-slate-800 text-emerald-400 border border-slate-700/90 rounded-xl shadow-xl transition-all cursor-pointer disabled:opacity-50"
          title="Fly to My Live GPS Location"
        >
          {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Crosshair className="w-4 h-4" />}
        </button>

        {/* Fit All Incidents */}
        <button
          type="button"
          onClick={handleFitAll}
          className="p-2.5 bg-slate-950/95 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/90 rounded-xl shadow-xl transition-all cursor-pointer"
          title="Center on All Active Emergencies"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="p-2 bg-slate-950/95 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/90 rounded-xl shadow-xl transition-all font-bold text-sm leading-none cursor-pointer"
          title="Zoom In"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="p-2 bg-slate-950/95 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/90 rounded-xl shadow-xl transition-all font-bold text-sm leading-none cursor-pointer"
          title="Zoom Out"
        >
          −
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => {
            setIsFullscreen(!isFullscreen);
            setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
          }}
          className="p-2.5 bg-slate-950/95 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/90 rounded-xl shadow-xl transition-all cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Map Legend Overlay at Bottom */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/95 backdrop-blur-md border border-slate-700/90 rounded-xl p-2.5 text-xs text-slate-300 shadow-xl flex flex-wrap items-center gap-3.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping"></span>
          <span>Pending SOS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Resolved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block"></span>
          <span>Rescue Unit</span>
        </div>
        <div className="hidden sm:block text-[11px] text-slate-400 font-mono border-l border-slate-800 pl-3">
          Layer: <span className="text-white font-semibold capitalize">{currentTheme}</span>
        </div>
      </div>
    </div>
  );
};
