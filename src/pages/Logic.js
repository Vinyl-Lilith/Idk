import { useState, useEffect, useCallback } from 'react';
import { thresholdAPI } from '../services/api';
import { useWebSocket } from '../context/WebSocketContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save, RefreshCw, Thermometer, Droplets, FlaskConical, CheckCircle2, Clock, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

const ThresholdSection = ({ title, icon: Icon, color, children }) => (
  <section className="glass rounded-xl p-6 border transition-all duration-300 hover:border-opacity-30"
    style={{ borderColor: `${color}15` }}>
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
      <div className="p-2 rounded-lg" style={{ background: `${color}15` }}>
        <Icon size={15} style={{ color }} />
      </div>
      <h3 className="text-xs font-mono uppercase tracking-widest" style={{ color }}>{title}</h3>
    </div>
    {children}
  </section>
);

export const Logic = () => {
  const [thresholds, setThresholds] = useState(null);
  const [editing, setEditing] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { socket } = useWebSocket();

  const fetchThresholds = useCallback(async () => {
    try {
      const res = await thresholdAPI.get();
      setThresholds(res.data.data);
      setEditing(res.data.data);
    } catch { toast.error('Failed to fetch thresholds'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchThresholds(); }, [fetchThresholds]);

  useEffect(() => {
    if (!socket) return;
    const handler = () => fetchThresholds();
    socket.on('threshold_update', handler);
    return () => socket.off('threshold_update', handler);
  }, [socket, fetchThresholds]);

  const handleChange = (key, value) => setEditing(prev => ({ ...prev, [key]: parseFloat(value) }));

  const saveOne = async (key) => {
    try {
      await thresholdAPI.update({ [key]: editing[key] });
      toast.success(`${key} saved`);
      fetchThresholds();
    } catch { toast.error('Save failed'); }
  };

  const saveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await thresholdAPI.update({
        soil1: editing.soil1, soil2: editing.soil2,
        temp_high: editing.temp_high, temp_low: editing.temp_low,
        hum_high: editing.hum_high, hum_low: editing.hum_low,
        npk_n: editing.npk_n, npk_p: editing.npk_p, npk_k: editing.npk_k,
      });
      toast.success('All thresholds synced');
      fetchThresholds();
    } catch { toast.error('Sync failed'); }
    finally { setSaving(false); }
  };

  const Row = ({ label, fieldKey, color = '#00f5e8' }) => (
    <div className="flex items-end gap-2">
      <Input label={label} type="number" className="flex-1"
        value={editing[fieldKey] ?? ''} onChange={(e) => handleChange(fieldKey, e.target.value)} />
      <button onClick={() => saveOne(fieldKey)}
        className="mb-0 p-2.5 rounded-lg border border-white/5 text-slate-600 hover:border-cyber-400/30 hover:text-cyber-400 transition-all"
        title="Save this field">
        <CheckCircle2 size={16} />
      </button>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-cyber-400 gap-3">
      <RefreshCw className="animate-spin" size={24} />
      <p className="font-mono text-xs uppercase tracking-widest text-slate-600">loading_thresholds</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={14} className="text-cyber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-400/60">Automation Engine</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wider">
            AUTO<span className="text-cyber-400">LOGIC</span>
          </h1>
        </div>
        <div className="glass rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3">
          <Clock size={14} className="text-cyber-400/50" />
          <div>
            <p className="text-xs font-mono text-slate-600">Last Arduino Sync</p>
            <p className="text-xs font-mono text-cyber-400">
              {thresholds?.lastSyncedWithArduino
                ? new Date(thresholds.lastSyncedWithArduino).toLocaleTimeString()
                : 'never'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={saveAll} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ThresholdSection title="Soil Moisture (%)" icon={Droplets} color="#34d399">
            <div className="space-y-4">
              <Row label="Soil Sensor 1 — trigger irrigation" fieldKey="soil1" />
              <Row label="Soil Sensor 2 — trigger irrigation" fieldKey="soil2" />
            </div>
          </ThresholdSection>

          <ThresholdSection title="Climate Control (°C)" icon={Thermometer} color="#fb923c">
            <div className="space-y-4">
              <Row label="Temp High — activate cooling" fieldKey="temp_high" />
              <Row label="Temp Low — alert threshold" fieldKey="temp_low" />
            </div>
          </ThresholdSection>

          <ThresholdSection title="Air Humidity (%)" icon={Droplets} color="#60a5fa">
            <div className="space-y-4">
              <Row label="Humidity High — exhaust fan ON" fieldKey="hum_high" />
              <Row label="Humidity Low — alert threshold" fieldKey="hum_low" />
            </div>
          </ThresholdSection>

          <ThresholdSection title="Soil Nutrients — mg/kg" icon={FlaskConical} color="#a78bfa">
            <div className="grid grid-cols-3 gap-3">
              <Input label="Nitrogen" type="number" value={editing.npk_n ?? ''} onChange={(e) => handleChange('npk_n', e.target.value)} />
              <Input label="Phosphorus" type="number" value={editing.npk_p ?? ''} onChange={(e) => handleChange('npk_p', e.target.value)} />
              <Input label="Potassium" type="number" value={editing.npk_k ?? ''} onChange={(e) => handleChange('npk_k', e.target.value)} />
            </div>
            <p className="text-xs font-mono text-slate-700 mt-3">* Use "Save All" below for NPK bulk update</p>
          </ThresholdSection>
        </div>

        {/* Sticky save bar */}
        <div className="sticky bottom-4 glass border border-cyber-400/15 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ boxShadow: '0 0 40px rgba(0,245,232,0.08)' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyber-400/10">
              <Save size={18} className="text-cyber-400" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-white">Sync All Thresholds</p>
              <p className="font-mono text-xs text-slate-600 mt-0.5">Pushes updates to all sensors simultaneously</p>
            </div>
          </div>
          <Button type="submit" isLoading={saving} size="lg" className="w-full sm:w-auto">
            {saving ? 'Syncing...' : 'Save All Changes'}
          </Button>
        </div>
      </form>

      <div className="flex justify-between text-xs font-mono text-slate-800 px-1">
        <span>updated_at: {thresholds?.updatedAt ? new Date(thresholds.updatedAt).toLocaleString() : 'N/A'}</span>
        <span>node: GH-01 · BioCube v1.0</span>
      </div>
    </div>
  );
};
