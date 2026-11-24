
import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { DATA_COMM_SPECS } from '../data/mockData';
import {
  Smartphone,
  Wifi,
  Server,
  Radio,
  Monitor,
  Shield,
  Play,
  CheckCircle2,
  Layers,
  Code2,
  Network,
  RefreshCw
} from 'lucide-react';

export const DataCommunicationView: React.FC = () => {
  const { packetLogs, lastSubmittedAlert } = useEmergency();

  // Animation simulation state
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'headers' | 'websocket'>('json');

  const pipelineStages = [
    {
      id: 1,
      title: "1. Victim's Smartphone",
      sub: "Sender Node",
      port: "Port 5500 / 3000",
      ip: "192.168.1.104",
      icon: Smartphone,
      tech: "HTML5 Geolocation API, Client REST Dispatch",
      color: "border-red-400 text-red-700 bg-red-50"
    },
    {
      id: 2,
      title: "2. Transmission Medium",
      sub: "Wi-Fi / 4G-5G Radio",
      port: "802.11ax / TCP/IP",
      ip: "Gateway: 192.168.1.1",
      icon: Wifi,
      tech: "Unshielded Wireless RF, TCP 3-Way Handshake",
      color: "border-cyan-400 text-cyan-700 bg-cyan-50"
    },
    {
      id: 3,
      title: "3. FastAPI Dispatch Server",
      sub: "Backend Broker",
      port: "Port 8000 (Python / Node)",
      ip: "192.168.1.200",
      icon: Server,
      tech: "Uvicorn / ASGI, Endpoint: POST /api/v1/sos",
      color: "border-amber-400 text-amber-700 bg-amber-50"
    },
    {
      id: 4,
      title: "4. Full-Duplex WebSocket Broadcast",
      sub: "RFC 6455 Channel",
      port: "ws://localhost:8000/ws/alerts",
      ip: "Multiplexed TCP Stream",
      icon: Radio,
      tech: "Low-latency JSON Event Fan-Out (<5ms)",
      color: "border-purple-400 text-purple-700 bg-purple-50"
    },
    {
      id: 5,
      title: "5. Coordinator Dashboard",
      sub: "Receiver Station",
      port: "Browser Client Ingestion",
      ip: "192.168.1.150",
      icon: Monitor,
      tech: "Leaflet GIS Render, Dispatch Queue Ingestion",
      color: "border-green-400 text-green-700 bg-green-50"
    },
    {
      id: 6,
      title: "6. Rescue Team Assignment",
      sub: "Target Responder Node",
      port: "VHF Radio / Mobile Push",
      ip: "Rescue Unit Alpha",
      icon: Shield,
      tech: "GPS Waypoint Navigation, Team Dispatch Lock",
      color: "border-blue-400 text-blue-700 bg-blue-50"
    }
  ];

  const runSimulation = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setActiveStep(1);

    const stepTime = 1100;

    for (let i = 1; i <= 6; i++) {
      setTimeout(() => {
        setActiveStep(i);

        if (i === 6) {
          setTimeout(() => {
            setIsSimulating(false);
          }, 1200);
        }
      }, (i - 1) * stepTime);
    }
  };

  const sampleJsonPayload = JSON.stringify(
    {
      header: {
        protocol: "HTTP/1.1",
        method: "POST",
        endpoint: "/api/v1/sos",
        timestamp: "2026-11-02T21:52:41.000Z",
        client_ip: "192.168.1.104",
        client_port: 5500,
        server_port: 8000
      },
      payload: {
        emergency_id: lastSubmittedAlert?.id || "RN-84102",
        victim_name: lastSubmittedAlert?.victimName || "Rameshwar Shinde",
        phone: lastSubmittedAlert?.phone || "+91 98231 44521",
        type: lastSubmittedAlert?.type || "Medical",
        priority: "CRITICAL",
        coordinates: {
          latitude: lastSubmittedAlert?.latitude || 18.6763,
          longitude: lastSubmittedAlert?.longitude || 73.8951,
          accuracy_meters: 8.4
        },
        location_descriptor: lastSubmittedAlert?.locationName || "Near MIT Academy of Engineering, Alandi",
        message: lastSubmittedAlert?.message || "Acute cardiac distress, need immediate paramedic ambulance.",
        checksum_crc32: "0x89F12A0C"
      }
    },
    null,
    2
  );

  const sampleHttpHeaders = `POST /api/v1/sos HTTP/1.1
Host: 192.168.1.200:8000
User-Agent: RescueNet-Mobile/1.0 (Android; Geolocation/W3C)
Content-Type: application/json; charset=utf-8
Content-Length: ${sampleJsonPayload.length}
Origin: http://192.168.1.104:5500
X-Transmission-Medium: IEEE 802.11ax (Wi-Fi 6)
Connection: keep-alive
Authorization: Bearer RN_TOKEN_DEMO_HASH_99`;

  const sampleWebSocketFrame = `FIN: 1 | RSV: 000 | OPCODE: 0x1 (Text Frame)
MASK: 1 | PAYLOAD_LEN: 384 Bytes
Masking-Key: 0x37fa21b9
Event: "EMERGENCY_DISPATCH_BROADCAST"
Payload:
{
  "event": "NEW_ALERT",
  "id": "${lastSubmittedAlert?.id || 'RN-84102'}",
  "type": "${lastSubmittedAlert?.type || 'Medical'}",
  "status": "Pending",
  "coords": [${lastSubmittedAlert?.latitude || 18.6763}, ${lastSubmittedAlert?.longitude || 73.8951}],
  "broadcast_epoch": 1793664761000
}`;

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
            <Network className="w-4 h-4" />
            <span>Academic Curriculum Demonstration · Data Communication Domain</span>
          </div>

          <h1 className="text-3xl font-extrabold text-green-950 tracking-tight">
            Data Communication Architecture & Flow
          </h1>

          <p className="text-gray-600 text-sm mt-1 max-w-3xl">
            Interactive breakdown of the OSI / TCP-IP network protocol stack, socket binding, transmission media, and packet routing governing the Rescue-Net emergency broadcast pipeline.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          {isSimulating
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <Play className="w-4 h-4" />
          }
          <span>
            {isSimulating ? 'Propagating Packet...' : 'Simulate SOS Packet Transmission'}
          </span>
        </button>
      </div>

      {/* Animated Data-Flow Pipeline */}
      <div className="bg-white border border-green-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-green-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-green-700" />
            <span>End-to-End Transmission Pipeline</span>
          </h2>

          <span className="text-xs font-mono text-gray-500">
            {isSimulating
              ? `Active Stage: ${activeStep} of 6`
              : 'Status: Ready for Packet Burst'
            }
          </span>
        </div>

        {/* Pipeline Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
          {pipelineStages.map((stg) => {
            const Icon = stg.icon;
            const isCurrent = activeStep === stg.id;
            const isPast = activeStep > stg.id;

            return (
              <div
                key={stg.id}
                className={`p-4 rounded-xl border transition-all duration-300 relative ${
                  isCurrent
                    ? `${stg.color} ring-2 ring-green-300 shadow-lg scale-[1.02]`
                    : isPast
                    ? 'border-green-300 bg-green-50 text-green-900'
                    : 'border-green-100 bg-green-50/50 text-gray-600'
                }`}
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCurrent
                          ? 'bg-white text-green-900'
                          : isPast
                          ? 'bg-green-700 text-white'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : stg.id}
                    </div>

                    <span className="text-xs font-mono uppercase font-bold text-gray-600">
                      {stg.sub}
                    </span>
                  </div>

                  <Icon className={`w-5 h-5 ${isCurrent ? 'animate-bounce' : ''}`} />
                </div>

                <h3 className="text-sm font-bold text-green-950 mt-1">
                  {stg.title}
                </h3>

                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500">Port / Protocol:</span>
                    <span className="font-mono text-gray-700 text-right">{stg.port}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500">Node IP:</span>
                    <span className="font-mono text-green-700 text-right">{stg.ip}</span>
                  </div>

                  <div className="pt-2 text-[11px] text-gray-600 border-t border-green-200">
                    {stg.tech}
                  </div>
                </div>

                {isCurrent && (
                  <div className="mt-3 pt-2 text-[10px] font-mono text-amber-700 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Processing & serializing byte payload...</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Transmission Parameters Strip */}
        <div className="mt-6 pt-6 border-t border-green-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">

          <div className="bg-green-50 p-3 rounded-xl border border-green-200">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Frontend Node</span>
            <span className="text-xs font-mono font-bold text-green-950">Port 5500 (HTTP)</span>
          </div>

          <div className="bg-green-50 p-3 rounded-xl border border-green-200">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">FastAPI Server</span>
            <span className="text-xs font-mono font-bold text-green-950">Port 8000 (ASGI)</span>
          </div>

          <div className="bg-green-50 p-3 rounded-xl border border-green-200">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Duplex Channel</span>
            <span className="text-xs font-mono font-bold text-green-700">WebSocket /ws/alerts</span>
          </div>

          <div className="bg-green-50 p-3 rounded-xl border border-green-200">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Average Latency</span>
            <span className="text-xs font-mono font-bold text-green-700">14.2 ms</span>
          </div>
        </div>
      </div>

      {/* Protocol Inspection & OSI Model Mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Packet Inspector */}
        <div className="lg:col-span-7 bg-white border border-green-200 rounded-2xl p-6 shadow-sm space-y-4">

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-green-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-green-950 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-green-700" />
                <span>Protocol Frame & Packet Inspector</span>
              </h2>

              <p className="text-xs text-gray-600 mt-0.5">
                Inspect raw serializations for HTTP requests and WebSocket broadcast frames.
              </p>
            </div>

            {/* Format toggle */}
            <div className="flex items-center gap-1 p-1 bg-green-50 rounded-lg border border-green-200 text-xs">
              <button
                onClick={() => setSelectedFormat('json')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedFormat === 'json'
                    ? 'bg-green-700 text-white'
                    : 'text-gray-600 hover:text-green-800'
                }`}
              >
                JSON Payload
              </button>

              <button
                onClick={() => setSelectedFormat('headers')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedFormat === 'headers'
                    ? 'bg-green-700 text-white'
                    : 'text-gray-600 hover:text-green-800'
                }`}
              >
                HTTP Header
              </button>

              <button
                onClick={() => setSelectedFormat('websocket')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  selectedFormat === 'websocket'
                    ? 'bg-green-700 text-white'
                    : 'text-gray-600 hover:text-green-800'
                }`}
              >
                WS Frame
              </button>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="bg-green-950 p-4 rounded-xl border border-green-900 font-mono text-xs text-green-100 overflow-x-auto max-h-96 leading-relaxed">
              {selectedFormat === 'json' && sampleJsonPayload}
              {selectedFormat === 'headers' && sampleHttpHeaders}
              {selectedFormat === 'websocket' && sampleWebSocketFrame}
            </pre>
          </div>

          {/* Recent Transmission Audit Log */}
          <div className="pt-2">
            <span className="text-xs font-bold text-gray-600 block mb-2">
              Recent Socket Packet Activity:
            </span>

            <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px] pr-1">
              {packetLogs.map((pkt) => (
                <div
                  key={pkt.id}
                  className="p-2 bg-green-50 border border-green-100 rounded flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-green-700 font-bold">[{pkt.protocol}]</span>
                    <span className="text-gray-700 truncate">{pkt.summary}</span>
                  </div>

                  <div className="text-gray-500 whitespace-nowrap text-[10px]">
                    {pkt.timestamp} · {pkt.latencyMs}ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: TCP/IP Architecture */}
        <div className="lg:col-span-5 space-y-4">

          <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-green-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-green-700" />
              <span>TCP/IP Stack In Emergency Broadcast</span>
            </h2>

            <div className="space-y-3">
              {DATA_COMM_SPECS.architecture.map((layer, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 p-3.5 rounded-xl border border-green-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-green-950">
                      {layer.layer}
                    </span>

                    <span className="text-[10px] font-mono text-green-700 font-bold bg-green-100 px-1.5 py-0.5 rounded border border-green-200">
                      {layer.protocols}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {layer.description}
                  </p>

                  <div className="text-[10px] font-mono text-gray-500 pt-1">
                    {layer.ports}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Viva Questions Helper */}
          <div className="bg-white border border-green-200 rounded-2xl p-5 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-green-800">
              Data Communication Viva Summary
            </h3>

            <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
              <li>
                <strong className="text-green-950">Why WebSocket over HTTP Polling?</strong> WebSocket maintains an open full-duplex TCP stream without HTTP header overhead, reducing alert delivery latency from seconds to under 20 milliseconds.
              </li>

              <li>
                <strong className="text-green-950">Transport Reliability:</strong> TCP ensures zero loss of emergency SOS packets via sequence ACK numbers and checksum verification.
              </li>

              <li>
                <strong className="text-green-950">Geospatial Payload:</strong> W3C Geolocation coordinates are encoded in JSON WGS84 format (Decimal Degrees).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
