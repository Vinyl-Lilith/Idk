import { useState, useEffect, useCallback } from 'react';
import { manualAPI, sensorAPI } from '../services/api';
import { useWebSocket } from '../context/WebSocketContext';
import { Switch } from '../components/ui/Switch';
import { Slider } from '../components/ui/Slider';
import { Button } from '../components/ui/Button';
import { Power, Fan, Droplets, Zap, AlertTriangle, RotateCcw, Wind, FlaskConical, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';

const ActuatorCard = ({ icon: Icon, title, subtitle, name, color, hasPwm, actuators, pwm, onControl, onPwm, manualMode }) => {
  const isOn = actuators[name];

  return (
    <div className={`glass rounded-xl p-5 border transition-all duration-300 relative overflow-hidden ${
      isOn ? 'border-opacity-40' : 'border-white/5 hover:border-white/10'
    }`} style={isOn ? { borderColor: `${color}40`, boxShadow: `0 0 20px ${color}10` } : {}}>

      {isOn && (
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl transition-all duration-300"
            style={{ background: isOn ? `${color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${isOn ? color + '30' : 'transparent'}` }}>
            <Icon size={18} style={{ color: isOn ? color : '#475569' }} />
          </div>
          <div>
            <p className="text-sm font-mono font-medium text-slate-200">{title}</p>
            {subtitle && <p className="text-xs font-mono text-slate-600 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <Switch checked={isOn} onChange={(val) => onControl(name, val)} disabled={!manualMode && !isOn} />
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isOn ? 'animate-pulse' : 'bg-slate-700'}`}
          style={isOn ? { background: color, boxShadow: `0 0 6px ${color}` } : {}} />
        <span className="text-xs font-mono" style={{ color: isOn ? color : '#334155' }}>
          {isOn ? 'ACTIVE' : 'STANDBY'}
        </span>
      </div>

      {hasPwm && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <Slider label="Power (PWM)" min={0} max={255} value={pwm[name] || 0} onChange={(v) => onPwm(name, v)} />
        </div>
      )}
    </div>
  );
};

export const Manual = () => {
  const [sensorData, setSensorData] = useState(null);
  const [actuators, setActuators] = useState({
    pump_water: false, pump_nutrient: false,
    fan_exhaust: false, peltier: false,
    fan_peltier_hot: false, fan_peltier_cold: false,
  });
  const [pwm, setPwm] = useState({ fan_exhaust: 0, peltier: 0 });
  const [manualMode, setManualMode] = useState(false);
  const { socket } = useWebSocket();

  const fetchLatest = useCallback(async () => {
    try {
      const res = await sensorAPI.getLatest();
      setSensorData(res.data.data);
      if (res.data.data?.actuators) {
        setActuators(res.data.data.actuators);
        setManualMode(res.data.data.actuators.manual_override);
      }
    } catch { console.error('Failed to fetch latest'); }
  }, []);

  useEffect(() => { fetchLatest(); }, [fetchLatest]);

  useEffect(() => {
    if (!socket) return;
    const handleReading = (reading) => {
      setSensorData(reading);
      if (reading.actuators) { setActuators(reading.actuators); setManualMode(reading.actuators.manual_override); }
    };
    const handleControl = (data) => setActuators(prev => ({ ...prev, [data.actuator]: data.state }));
    socket.on('new_reading', handleReading);
    socket.on('manual_control', handleControl);
    return () => { socket.off('new_reading', handleReading); socket.off('manual_control', handleControl); };
  }, [socket]);

  const controlActuator = async (actuator, state, pwmValue = null) => {
    try {
      const data = { actuator, state };
      if (pwmValue !== null) data.pwm = pwmValue;
      await manualAPI.control(data);
      setActuators(prev => ({ ...prev, [actuator]: state }));
      if (!manualMode) setManualMode(true);
      toast.success(`${actuator.replace(/_/g, ' ')} → ${state ? 'ON' : 'OFF'}`);
    } catch { toast.error('Control failed'); }
  };

  const handlePwm = (actuator, value) => {
    setPwm(prev => ({ ...prev, [actuator]: value }));
    controlActuator(actuator, true, value);
  };

  const resumeAuto = async () => {
    if (!window.confirm('Resume automatic mode? Manual controls will be disabled.')) return;
    try {
      await manualAPI.resumeAuto();
      setManualMode(false);
      toast.success('Automation restored');
    } catch { toast.error('Failed to resume auto mode'); }
  };

  const actuatorDefs = [
    { icon: Droplets, title: 'Water Pump', subtitle: 'Irrigation system', name: 'pump_water', color: '#60a5fa' },
    { icon: FlaskConical, title: 'Nutrient Pump', subtitle: 'Fertigation system', name: 'pump_nutrient', color: '#a78bfa' },
    { icon: Wind, title: 'Exhaust Fan', subtitle: 'Ventilation + PWM', name: 'fan_exhaust', color: '#34d399', hasPwm: true },
    { icon: Zap, title: 'Peltier Cooler', subtitle: 'Thermoelectric + PWM', name: 'peltier', color: '#fb923c', hasPwm: true },
    { icon: Fan, title: 'Peltier Hot Fan', subtitle: 'Heat dissipation', name: 'fan_peltier_hot', color: '#fc8181' },
    { icon: Fan, title: 'Peltier Cold Fan', subtitle: 'Cold side circulation', name: 'fan_peltier_cold', color: '#67e8f9' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders size={14} className="text-cyber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-400/60">Direct Override</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wider">
            MANUAL<span className="text-cyber-400">CTL</span>
          </h1>
        </div>
        {manualMode && (
          <Button variant="danger" icon={<RotateCcw size={14} />} onClick={resumeAuto} size="md"
            className="animate-pulse">
            Resume Automation
          </Button>
        )}
      </div>

      {/* Mode banner */}
      {manualMode ? (
        <div className="flex items-center gap-3 glass rounded-xl px-5 py-4 border border-amber-500/20"
          style={{ background: 'rgba(245,158,11,0.05)' }}>
          <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-mono font-semibold text-amber-400">MANUAL OVERRIDE ACTIVE</p>
            <p className="text-xs font-mono text-slate-600 mt-0.5">Greenhouse automation is paused. All actuators are under direct control.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 glass rounded-xl px-5 py-4 border border-cyber-400/10">
          <Power size={16} className="text-cyber-400 flex-shrink-0" />
          <p className="text-xs font-mono text-slate-500">System following automation logic — toggling any actuator will activate manual override</p>
        </div>
      )}

      {/* Actuator Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actuatorDefs.map((def) => (
          <ActuatorCard key={def.name} {...def} actuators={actuators} pwm={pwm}
            onControl={controlActuator} onPwm={handlePwm} manualMode={manualMode} />
        ))}
      </div>

      {/* Live stats footer */}
      <div className="glass rounded-xl p-5 border border-white/5">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-4">// Current Environment</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Temperature', value: sensorData?.temp?.toFixed(1), unit: '°C', color: '#fb923c' },
            { label: 'Humidity', value: sensorData?.hum?.toFixed(1), unit: '%', color: '#60a5fa' },
            { label: 'Soil 1', value: sensorData?.soil1?.toFixed(1), unit: '%', color: '#34d399' },
            { label: 'Soil 2', value: sensorData?.soil2?.toFixed(1), unit: '%', color: '#00f5e8' },
          ].map(({ label, value, unit, color }) => (
            <div key={label}>
              <p className="text-xs font-mono text-slate-700 mb-1">{label}</p>
              <p className="text-xl font-mono font-bold tabular-nums" style={{ color }}>
                {value ?? '--'}<span className="text-sm ml-1 opacity-60">{unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
