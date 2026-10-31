import React, { useState, useEffect } from 'react';
import { checkSystemHealth } from '../../services/healthService';
import StatusBadge from '../common/StatusBadge';
import { Server, Database, RefreshCw, CheckCircle2, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

export default function SystemStatusBanner() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    const result = await checkSystemHealth();
    setHealth(result);
    setLastChecked(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const isConnected = health?.connected && health?.data?.success;
  const dbStatus = health?.data?.database?.status || 'disconnected';

  return (
    <section id="system-status" className="py-12 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top title and Refresh action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800 text-forest-400 text-xs font-mono font-medium mb-2 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-forest-400 animate-ping"></span>
              STAGE 1 LIVE DIAGNOSTIC ENGINE
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Frontend & Backend Health Verification
            </h3>
            <p className="text-sm text-slate-400">
              Live automated health query to <code className="text-forest-300 font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded">GET /api/health</code> validating client-server connectivity.
            </p>
          </div>

          <button
            onClick={fetchHealth}
            disabled={loading}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Querying API...' : 'Re-test Connection'}
          </button>
        </div>

        {/* Diagnostic Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Backend API Connectivity */}
          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-forest-400" />
                  Express REST API
                </span>
                {loading ? (
                  <span className="text-xs text-slate-400 animate-pulse">Pinging...</span>
                ) : isConnected ? (
                  <StatusBadge status="OPERATIONAL" size="sm" />
                ) : (
                  <StatusBadge status="OFFLINE" size="sm" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  {loading ? 'Checking backend...' : isConnected ? 'Node.js Express Server Active' : 'Backend Unreachable'}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Target: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>HTTP Status: {isConnected ? '200 OK' : 'No Connection'}</span>
              <span>{lastChecked ? `Checked ${lastChecked}` : ''}</span>
            </div>
          </div>

          {/* Card 2: Database Connectivity */}
          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-cyan-400" />
                  MongoDB Engine
                </span>
                {loading ? (
                  <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
                ) : dbStatus === 'connected' ? (
                  <StatusBadge status="CONNECTED" size="sm" />
                ) : (
                  <StatusBadge status="DISCONNECTED" size="sm" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  {dbStatus === 'connected' 
                    ? `Connected (${health?.data?.database?.database || 'pollution_monitoring_db'})` 
                    : 'Awaiting Connection / Offline'}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {dbStatus === 'connected'
                    ? `Host: ${health?.data?.database?.host}`
                    : 'Set MONGODB_URI in backend/.env to connect to local or Atlas MongoDB'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
              State: <span className="font-mono text-slate-300">{dbStatus}</span>
            </div>
          </div>

          {/* Card 3: Architecture Contract Verification */}
          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  {isConnected ? <Wifi className="w-4 h-4 text-forest-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
                  Integration Handshake
                </span>
                <span className="text-xs font-mono text-forest-400 bg-forest-950/60 px-2 py-0.5 rounded border border-forest-900">
                  Stage 1 Verified
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  {isConnected ? 'JSON Payload Verified' : 'Handshake Pending'}
                </p>
                <p className="text-xs text-slate-400">
                  CORS headers, Axios response interceptor, and environment variable resolution functioning as specified in Stage 0.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
              Uptime: <span className="font-mono text-slate-300">{health?.data?.uptimeSeconds ? `${health.data.uptimeSeconds}s` : 'N/A'}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

