
import React, { useState } from 'react';
import {
  GraduationCap,
  User,
  Award,
  Terminal,
  Server,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  BookOpen
} from 'lucide-react';

export const ProjectInfoView: React.FC = () => {
  const [copiedFastApi, setCopiedFastApi] = useState(false);
  const [copiedFrontend, setCopiedFrontend] = useState(false);

  const copyCode = (text: string, type: 'fastapi' | 'frontend') => {
    navigator.clipboard.writeText(text);

    if (type === 'fastapi') {
      setCopiedFastApi(true);
      setTimeout(() => setCopiedFastApi(false), 2000);
    } else {
      setCopiedFrontend(true);
      setTimeout(() => setCopiedFrontend(false), 2000);
    }
  };

  const fastApiCode = `# ===============================================================
# Rescue-Net: Emergency Communication Platform - FastAPI Backend
# Department of Information Technology - Data Communication Project
# Developers: Vinay Kale (65), Tina Savkare (67), Vivek Choursiya (68) | Guide: Mr. Shivaji Patil
# ===============================================================

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime
import uvicorn
import json

app = FastAPI(
    title="Rescue-Net Emergency Dispatch API",
    description="Full-duplex emergency SOS and coordinator dispatch server",
    version="1.0.0"
)

# CORS Configuration for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSocket connections pool
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_text(json.dumps(message))

manager = ConnectionManager()

# Data Models
class SOSAlertCreate(BaseModel):
    victim_name: str
    phone: Optional[str] = "N/A"
    emergency_type: str  # Medical, Fire, Accident, Natural Disaster, Other
    message: str
    location_name: str
    latitude: float
    longitude: float
    priority: str = "High"

# In-Memory DB (Can be hooked to MongoDB)
emergencies_db = []

@app.post("/api/v1/sos", status_code=201)
async def broadcast_sos(alert: SOSAlertCreate):
    emergency_id = f"RN-{len(emergencies_db) + 84100}"
    timestamp = datetime.datetime.utcnow().isoformat()
    record = {
        "id": emergency_id,
        "timestamp": timestamp,
        "status": "Pending",
        **alert.dict()
    }
    emergencies_db.append(record)

    # Broadcast to all connected coordinator dashboards via WebSocket
    await manager.broadcast({
        "event": "NEW_EMERGENCY_ALERT",
        "data": record
    })
    return {"status": "SUCCESS", "emergency_id": emergency_id, "data": record}

@app.get("/api/v1/emergencies")
async def list_emergencies():
    return {"count": len(emergencies_db), "records": emergencies_db}

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep alive and listen for client-initiated ping/acks
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    # Runs on Port 8000 as defined in Data Comm Architecture
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)`;

  const localRunSteps = `# 1. Clone repository
git clone https://github.com/vinaykale/rescue-net.git
cd rescue-net

# 2. Install Frontend Dependencies (Port 3000 / 5500)
npm install
npm run dev

# 3. Optional: Run Python FastAPI Backend (Port 8000)
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic
python main.py`;

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">

      {/* Dossier Header */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-950 border border-green-700 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6">

          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/30 text-green-50 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>Department of Information Technology</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Rescue-Net
            </h1>

            <p className="text-base text-green-50 font-medium">
              Emergency Communication and Coordination Platform
            </p>

            <p className="text-xs text-green-100 leading-relaxed max-w-2xl">
              Engineered as a full-stack Data Communication platform showcasing the operational transition from HTTP client request to persistent WebSocket broadcast, geospatial GIS routing with Leaflet, and tactical rescue fleet dispatch.
            </p>
          </div>

          {/* Project Credentials Badge */}
          <div className="bg-white rounded-2xl p-6 space-y-4 min-w-[280px] shadow-lg">

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                Project Developers
              </span>

              <div className="space-y-1.5">

                <div className="text-sm font-bold text-green-950 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-green-700" />
                    <span>Vinay Kale</span>
                  </span>
                  <span className="text-xs font-mono text-green-800 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Roll 65
                  </span>
                </div>

                <div className="text-sm font-bold text-green-950 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-green-700" />
                    <span>Tina Savkare</span>
                  </span>
                  <span className="text-xs font-mono text-green-800 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Roll 67
                  </span>
                </div>

                <div className="text-sm font-bold text-green-950 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-green-700" />
                    <span>Vivek Choursiya</span>
                  </span>
                  <span className="text-xs font-mono text-green-800 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    Roll 68
                  </span>
                </div>

              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block">
                Project Guide & Mentor
              </span>

              <div className="text-sm font-bold text-green-950 flex items-center gap-2 mt-0.5">
                <Award className="w-4 h-4 text-green-700" />
                <span>Mr. Shivaji Patil</span>
              </div>
            </div>

            <div className="pt-2 border-t border-green-100 text-xs text-gray-600 space-y-1">
              <div>
                <span className="text-gray-500">Domain:</span>{' '}
                <strong className="text-green-950">Data Communication</strong>
              </div>

              <div>
                <span className="text-gray-500">Focus:</span> TCP/IP, Full-Duplex WebSockets, GIS
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white border border-green-200 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>

          <h3 className="text-base font-bold text-green-950">
            Frontend Architecture
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Built using modern React, TypeScript, Tailwind CSS, and Vite. Features high-contrast dark navy mode, responsive layouts, audio synthesized alert cues, and dynamic client-side filtering.
          </p>

          <div className="text-[11px] font-mono text-green-700 pt-1">
            Stack: React 19, TypeScript, Lucide, Tailwind CSS
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>

          <h3 className="text-base font-bold text-green-950">
            Backend & Communication
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Python FastAPI with Uvicorn ASGI server and RFC 6455 WebSockets. Provides REST endpoints for alert creation and event broadcasting with structured JSON packets.
          </p>

          <div className="text-[11px] font-mono text-green-700 pt-1">
            Stack: FastAPI, WebSocket Protocol, JSON Data Serialization
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>

          <h3 className="text-base font-bold text-green-950">
            Geospatial Mapping
          </h3>

          <p className="text-xs text-gray-600 leading-relaxed">
            Integrated Leaflet.js with OpenStreetMap. Supports interactive beacon placement, status-coded styling (Red, Amber, Green), popup dossiers, and draggable victim location pins.
          </p>

          <div className="text-[11px] font-mono text-green-700 pt-1">
            Engine: Leaflet 1.9, OpenStreetMap, CartoDB Tiles
          </div>
        </div>

      </div>

      {/* Python FastAPI Implementation */}
      <div className="bg-white border border-green-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-green-950 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-green-700" />
              <span>Python FastAPI WebSocket Server Code (`main.py`)</span>
            </h2>

            <p className="text-xs text-gray-600 mt-0.5">
              Reference implementation matching the Data Communication architecture specifications.
            </p>
          </div>

          <button
            onClick={() => copyCode(fastApiCode, 'fastapi')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {copiedFastApi
              ? <Check className="w-3.5 h-3.5" />
              : <Copy className="w-3.5 h-3.5" />
            }
            <span>{copiedFastApi ? 'Copied Python Code' : 'Copy main.py'}</span>
          </button>
        </div>

        <pre className="bg-green-950 p-4 rounded-xl border border-green-900 font-mono text-xs text-green-100 overflow-x-auto max-h-96 leading-relaxed">
          {fastApiCode}
        </pre>
      </div>

      {/* Local Execution & Deployment Guide */}
      <div className="bg-white border border-green-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-green-950 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-700" />
              <span>Local Deployment & Presentation Guide</span>
            </h2>

            <p className="text-xs text-gray-600 mt-0.5">
              Commands to run and demonstrate the project locally during project evaluation.
            </p>
          </div>

          <button
            onClick={() => copyCode(localRunSteps, 'frontend')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {copiedFrontend
              ? <Check className="w-3.5 h-3.5" />
              : <Copy className="w-3.5 h-3.5" />
            }
            <span>{copiedFrontend ? 'Copied Run Commands' : 'Copy Commands'}</span>
          </button>
        </div>

        <pre className="bg-green-950 p-4 rounded-xl border border-green-900 font-mono text-xs text-green-100 overflow-x-auto leading-relaxed">
          {localRunSteps}
        </pre>
      </div>

      {/* Simulation vs Production Notice */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-xs text-gray-700 space-y-1">
        <div className="font-bold text-green-950 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-700" />
          <span>Real Integration & Simulation Notice</span>
        </div>

        <p>
          • <strong>Browser GPS:</strong> Uses the genuine W3C Geolocation API (<code className="text-green-800 font-mono">navigator.geolocation</code>) triggered strictly on user consent.
        </p>

        <p>
          • <strong>Mapping:</strong> Real interactive Leaflet rendering with live OpenStreetMap raster tiles, coordinates, and custom markers.
        </p>

        <p>
          • <strong>Emergency Telemetry:</strong> Sample incidents centered around Alandi and Pune are realistic demonstration records clearly labeled for college evaluation and review.
        </p>
      </div>

    </div>
  );
};
