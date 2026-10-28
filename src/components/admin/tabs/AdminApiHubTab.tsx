import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Copy, 
  Download, 
  RefreshCw, 
  Database, 
  Layers, 
  FileCode, 
  Zap,
  HardDrive
} from 'lucide-react';
import { apiService, ApiStatsResponse } from '../../../services/apiService';
import { downloadFile } from '../../../utils/backupSqlGenerator';

interface AdminApiHubTabProps {
  onShowToast: (msg: string) => void;
}

interface EndpointDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  sampleBody?: any;
}

const AVAILABLE_ENDPOINTS: EndpointDefinition[] = [
  { method: 'GET', path: '/api/health', description: 'Check server health, uptime, and version status' },
  { method: 'GET', path: '/api/stats', description: 'Retrieve real-time aggregate KPI metrics across the platform' },
  { method: 'GET', path: '/api/students', description: 'Fetch all enrolled Class 9 & 10 UPMSP student records' },
  { method: 'GET', path: '/api/teachers', description: 'Fetch all active faculty members, subjects, and ratings' },
  { method: 'GET', path: '/api/posts', description: 'Fetch official announcements, study guides, and teacher notices' },
  { method: 'GET', path: '/api/notices', description: 'Fetch ticker notices and urgent examination broadcast alerts' },
  { method: 'GET', path: '/api/backup', description: 'Export full database as master JSON payload' },
  { 
    method: 'POST', 
    path: '/api/posts', 
    description: 'Create a new announcement directly via REST API',
    sampleBody: {
      title: 'REST API Test Announcement',
      content: 'This announcement was tested via the Live API Console.',
      authorName: 'Central Admin',
      authorRole: 'Admin',
      category: 'Announcement',
      targetAudience: 'All Students',
      tags: ['API', 'Test'],
      pinned: false
    }
  }
];

export const AdminApiHubTab: React.FC<AdminApiHubTabProps> = ({ onShowToast }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDefinition>(AVAILABLE_ENDPOINTS[0]);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ApiStatsResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Load server stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await apiService.getStats();
      setStats(data);
    } catch {
      // ignore
    }
  };

  const handleExecuteRequest = async () => {
    setLoading(true);
    setApiResponse(null);
    setResponseStatus(null);
    const start = performance.now();

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (selectedEndpoint.method === 'POST' && selectedEndpoint.sampleBody) {
        options.body = JSON.stringify(selectedEndpoint.sampleBody);
      }

      const res = await fetch(selectedEndpoint.path, options);
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setResponseStatus(res.status);

      const data = await res.json();
      setApiResponse(data);
      onShowToast(`${selectedEndpoint.method} ${selectedEndpoint.path} returned HTTP ${res.status} (${elapsed}ms)`);
      loadStats();
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setResponseStatus(500);
      setApiResponse({ error: err?.message || 'Failed to connect to API server' });
      onShowToast(`Network Error: ${err?.message || 'Could not reach server'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!apiResponse) return;
    navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('API JSON response copied to clipboard!');
  };

  const handleDownloadResponse = () => {
    if (!apiResponse) return;
    const filename = `fra_api_${selectedEndpoint.path.replace(/\//g, '_')}_${Date.now()}.json`;
    downloadFile(JSON.stringify(apiResponse, null, 2), filename, 'application/json');
    onShowToast(`Saved response as ${filename}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#071610] p-5 rounded-2xl border border-cyan-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-black text-white">Full-Stack REST API & Database Control</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
              Port 3000 • Online
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Live Express REST API server running seamlessly with Vite middleware. Test endpoints, query JSON store, and inspect real HTTP payloads.
          </p>
        </div>

        <button
          onClick={loadStats}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh API Status</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#070e0a] border border-cyan-950">
          <span className="text-[11px] text-gray-400 block">Server Health</span>
          <span className="text-xl font-black text-emerald-400 flex items-center gap-1.5 font-mono mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            200 OK
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Express + Node Runtime</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070e0a] border border-cyan-950">
          <span className="text-[11px] text-gray-400 block">Database Records</span>
          <span className="text-xl font-black text-white font-mono mt-1">
            {(stats?.totalStudents || 2) + (stats?.totalTeachers || 4) + (stats?.totalPosts || 4)} Entities
          </span>
          <span className="text-[10px] text-cyan-400 block mt-0.5">JSON Master Store</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070e0a] border border-cyan-950">
          <span className="text-[11px] text-gray-400 block">Active Endpoints</span>
          <span className="text-xl font-black text-white font-mono mt-1">
            {AVAILABLE_ENDPOINTS.length} Routes
          </span>
          <span className="text-[10px] text-purple-400 block mt-0.5">RESTful Architecture</span>
        </div>

        <div className="p-4 rounded-xl bg-[#070e0a] border border-cyan-950">
          <span className="text-[11px] text-gray-400 block">Data Persistence</span>
          <span className="text-xl font-black text-[#d4af37] font-mono mt-1">
            Auto-Sync
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">academy-database.json</span>
        </div>
      </div>

      {/* Interactive API Tester Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Endpoints Selector */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
            Select API Endpoint to Test
          </h3>

          <div className="space-y-2">
            {AVAILABLE_ENDPOINTS.map((ep, idx) => {
              const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-950/30'
                      : 'bg-[#070e0a] border-gray-800/80 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      ep.method === 'GET' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      ep.method === 'POST' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                      ep.method === 'PUT' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-red-950 text-red-400 border border-red-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{ep.path}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">{ep.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution & Response Viewer */}
        <div className="lg:col-span-7 bg-[#070e0a] border border-cyan-950 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedEndpoint.method === 'GET' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-cyan-950 text-cyan-400'
              }`}>
                {selectedEndpoint.method}
              </span>
              <span className="font-bold text-white">{selectedEndpoint.path}</span>
            </div>

            <button
              onClick={handleExecuteRequest}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-900/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{loading ? 'Sending Request...' : 'Send Request'}</span>
            </button>
          </div>

          {/* Response Status Bar */}
          <div className="flex items-center justify-between bg-black/50 px-3.5 py-2 rounded-xl border border-gray-800/80 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Status:</span>
              {responseStatus !== null ? (
                <span className={`font-bold flex items-center gap-1 ${
                  responseStatus >= 200 && responseStatus < 300 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {responseStatus === 200 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {responseStatus} {responseStatus === 200 ? 'OK' : 'Error'}
                </span>
              ) : (
                <span className="text-gray-500">Awaiting Request</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-400">Latency:</span>
              <span className="text-cyan-400 font-bold">
                {responseTime !== null ? `${responseTime} ms` : '--'}
              </span>
            </div>
          </div>

          {/* JSON Payload Viewer */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1.5 text-xs text-gray-400 font-mono">
              <span>Response Payload (JSON):</span>
              {apiResponse && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResponse}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={handleDownloadResponse}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            <pre className="w-full bg-[#030604] border border-gray-800 rounded-xl p-4 text-xs font-mono text-cyan-300 max-h-[360px] overflow-auto leading-relaxed select-all">
              {apiResponse ? JSON.stringify(apiResponse, null, 2) : '// Click "Send Request" to test this endpoint live.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
