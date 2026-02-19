import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { sensorAPI } from '../services/api';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Thermometer, Droplets, Sun, Download, FlaskConical,
  Wifi, WifiOff, RefreshCw, Camera, Maximize2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SensorCard } from '../components/ui/SensorCard';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-cyber-400/20 rounded-lg px-4 py-3 text-xs font-mono">
      <p className="text-slate-500 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value?.toFixed(2)}</span>
        </p>
      ))}
    </div>
  );
};

const SERIES = [
  { key: 'temp',         name: 'Temp °C',    color: '#fb923c' },
  { key: 'hum',          name: 'Humidity %', color: '#60a5fa' },
  { key: 'soil1',        name: 'Soil 1 %',   color: '#34d399' },
];

export const Homepage = () => {
  const [sensorData, setSensorData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeSeries, setActiveSeries] = useState(['temp', 'hum']);
  const [loading, setLoading] = useState(true);
  const [camExpanded, setCamExpanded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const { socket } = useWebSocket();

  const fetchLatest = useCallback(async () => {
    try {
      const res = await sensorAPI.getLatest();
      setSensorData(res.data.data);
      setLastUpdate(new Date());
    } catch { toast.error('Failed to fetch sensor data'); }
    finally { setLoading(false); }
  }, []);

  const fetchChartData = useCallback(async (date) => {
    try {
      const res = date === new Date().toISOString().split('T')[0]
        ? await sensorAPI.get24Hours()
        : await sensorAPI.getByDate(date);
      const fmt = (res.data.data || []).map((r) => ({
        ...r,
        timestamp: new Date(r.timestamp || r.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setChartData(fmt);
    } catch { toast.error('Failed to fetch chart data'); }
  }, []);

  useEffect(() => { fetchLatest(); fetchChartData(selectedDate); }, [fetchLatest, fetchChartData, selectedDate]);

  useEffect(() => {
    if (!socket) return;
    const handler = (reading) => { setSensorData(reading); setLastUpdate(new Date()); };
    socket.on('new_reading', handler);
    return () => socket.off('new_reading', handler);
  }, [socket]);

  const downloadExcel = async () => {
    try {
      const res = await sensorAPI.exportExcel(selectedDate);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `biocube-${selectedDate}.xlsx`;
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch { toast.error('Export failed'); }
  };

  const npk = sensorData?.npk;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-400 animate-pulse" style={{ boxShadow: '0 0 6px #00f5e8' }} />
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-400/60">Live Monitoring</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wider">
            ENVIRON<span className="text-cyber-400">MENT</span>
          </h1>
          <p className="text-xs font-mono text-slate-600 mt-1">
            {lastUpdate ? `last_sync: ${lastUpdate.toLocaleTimeString()}` : 'awaiting_data...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" value={selectedDate} max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="glass rounded-lg border border-white/5 text-slate-400 text-xs font-mono px-3 py-2 focus:outline-none focus:border-cyber-400/30 bg-transparent hover:border-cyber-400/20 transition-colors"
          />
          <Button variant="secondary" icon={<Download size={14} />} onClick={downloadExcel} size="sm">
            Export
          </Button>
          <button onClick={() => { fetchLatest(); fetchChartData(selectedDate); }}
            className="glass p-2 rounded-lg border border-white/5 text-slate-500 hover:text-cyber-400 hover:border-cyber-400/20 transition-all">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard label="Temperature" value={sensorData?.temp?.toFixed(1)} unit="°C" icon={Thermometer} colorClass="bg-orange-500" />
        <SensorCard label="Humidity" value={sensorData?.hum?.toFixed(1)} unit="%" icon={Droplets} colorClass="bg-blue-500" />
        <SensorCard label="Soil 1" value={sensorData?.soil1?.toFixed(1)} unit="%" icon={Droplets} colorClass="bg-emerald-500" sublabel="moisture sensor" />
        <SensorCard label="Soil 2" value={sensorData?.soil2?.toFixed(1)} unit="%" icon={Droplets} colorClass="bg-cyan-500" sublabel="moisture sensor" />
      </div>

      {/* NPK Bar */}
      {npk && (
        <div className="glass rounded-xl p-5 border border-purple-500/10">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical size={14} className="text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400/70">Soil Nutrients (NPK)</span>
            <div className={`ml-auto flex items-center gap-1.5 text-xs font-mono ${npk.ok ? 'text-cyber-400' : 'text-red-400'}`}>
              {npk.ok ? <Wifi size={12} /> : <WifiOff size={12} />}
              {npk.ok ? 'SENSOR OK' : 'SENSOR ERR'}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Nitrogen (N)', value: npk.n, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
              { label: 'Phosphorus (P)', value: npk.p, color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
              { label: 'Potassium (K)', value: npk.k, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="rounded-lg p-3" style={{ background: bg, border: `1px solid ${color}20` }}>
                <p className="text-xs font-mono text-slate-600 mb-1">{label}</p>
                <p className="text-2xl font-mono font-bold" style={{ color }}>{value ?? '--'}</p>
                <p className="text-xs font-mono text-slate-700 mt-0.5">mg/kg</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart + Camera row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass rounded-xl p-6 border border-cyber-400/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500">// Data Stream</h2>
              <p className="text-sm font-mono text-slate-300 mt-0.5">Climate Trends · {selectedDate}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {SERIES.map(({ key, name, color }) => (
                <button
                  key={key}
                  onClick={() => setActiveSeries(prev =>
                    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
                  )}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                    activeSeries.includes(key) ? 'opacity-100' : 'opacity-30'
                  }`}
                  style={{
                    background: activeSeries.includes(key) ? `${color}15` : 'transparent',
                    border: `1px solid ${color}40`,
                    color,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCw className="text-cyber-400 animate-spin" size={24} />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-700">
                <Sun size={32} className="mb-2 opacity-30" />
                <p className="font-mono text-xs">no_data_for_date</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    {SERIES.map(({ key, color }) => (
                      <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="timestamp" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
                  <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
                  <Tooltip content={<CustomTooltip />} />
                  {SERIES.filter(s => activeSeries.includes(s.key)).map(({ key, name, color }) => (
                    <Area key={key} type="monotone" dataKey={key} name={name}
                      stroke={color} strokeWidth={1.5} fill={`url(#grad-${key})`} fillOpacity={1}
                      dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Camera feed */}
        <div className="glass rounded-xl overflow-hidden border border-cyber-400/10 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="pulse-dot" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Live Feed</span>
            </div>
            <button onClick={() => setCamExpanded(true)}
              className="text-slate-600 hover:text-cyber-400 transition-colors p-1">
              <Maximize2 size={14} />
            </button>
          </div>

          <div className="relative flex-1 bg-void-900 min-h-48">
            <img
              src={`${process.env.REACT_APP_API_URL}/webcam/stream`}
              alt="Greenhouse Live Feed"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 flex-col items-center justify-center text-slate-700">
              <Camera size={32} className="mb-2 opacity-30" />
              <p className="font-mono text-xs">stream_unavailable</p>
            </div>

            {/* Overlay HUD */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs font-mono text-red-400/80 bg-black/50 px-1.5 py-0.5 rounded">REC</span>
            </div>
            <div className="absolute bottom-2 right-2 font-mono text-xs text-white/40 bg-black/40 px-2 py-1 rounded">
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-700">CAM-01 · Greenhouse</span>
            <span className="text-xs font-mono text-cyber-400/50">MJPEG</span>
          </div>
        </div>
      </div>

      {/* Camera modal */}
      {camExpanded && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCamExpanded(false)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="pulse-dot" />
                <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Live Feed · CAM-01</span>
              </div>
              <button onClick={() => setCamExpanded(false)} className="text-slate-500 hover:text-white font-mono text-xs">
                [close]
              </button>
            </div>
            <img src={`${process.env.REACT_APP_API_URL}/webcam/stream`} alt="Expanded Live Feed"
              className="w-full rounded-xl border border-cyber-400/10"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80'; }} />
          </div>
        </div>
      )}
    </div>
  );
};
