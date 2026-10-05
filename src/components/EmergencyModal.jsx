import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Phone,
  ShieldAlert,
  X,
  Send,
  CheckCircle2,
  Ambulance,
  PhoneCall,
  Radio
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/mockData';

export default function EmergencyModal({ isOpen, onClose }) {
  const { currentUser, raiseEmergency, buses } = useApp();
  const [selectedReason, setSelectedReason] = useState('MEDICAL');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isDriver = currentUser?.role === 'DRIVER';
  const assignedBus = buses.find(b => b.driverId === currentUser?.id) || buses[0];

  const handleBroadcast = (e) => {
    e.preventDefault();

    const reasonsMap = {
      MEDICAL: 'Medical Emergency on Campus Shuttle Route',
      BREAKDOWN: 'Bus Mechanical Breakdown / Flat Tire',
      OVERCROWD: 'Severe Overcrowding / Route Disruption',
      SECURITY: 'Safety / Harassment / Urgent Security Alert',
      ACCIDENT: 'Traffic Collision / Obstruction Alert'
    };

    raiseEmergency({
      type: selectedReason,
      senderRole: currentUser?.role || 'STUDENT',
      senderName: currentUser?.name || 'Campus Student',
      busId: assignedBus?.id || 'BUS-01',
      location: assignedBus?.nextStop || 'Hostel ↔ College Corridor',
      message: `${reasonsMap[selectedReason] || 'Emergency Assistance Requested'}. ${details ? `Note: ${details}` : ''}`,
      severity: selectedReason === 'MEDICAL' || selectedReason === 'SECURITY' ? 'CRITICAL' : 'HIGH'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0F1115] border border-[#EA580C]/50 shadow-[0_0_50px_rgba(234,88,12,0.4)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#EA580C]/30 to-[#F7931A]/20 p-5 border-b border-[#EA580C]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shadow-[0_0_20px_#EA580C]">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {isDriver ? 'Driver Emergency SOS Dispatch' : 'Emergency & Driver SOS'}
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono">
                Direct Hotline to Transport Manager & Campus Safety
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-xl text-white">SOS Broadcast Dispatched</h4>
            <p className="text-sm text-[#94A3B8] font-mono leading-relaxed">
              Alert transmitted with high priority to Fleet Manager ({EMERGENCY_CONTACTS.transportManager.name}) and nearby buses.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-[#FFD600] font-mono">
              Emergency Team Response ETA: Under 3 minutes
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Quick 1-Tap Direct Call Grid */}
            <div>
              <p className="text-xs font-mono uppercase text-[#94A3B8] tracking-wider mb-2.5">
                Instant Direct Hotline (Tap to Call)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`tel:${EMERGENCY_CONTACTS.transportManager.phone}`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F7931A]/60 flex items-center gap-3 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F7931A]/20 text-[#F7931A] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Transport Manager</p>
                    <p className="text-[10px] text-[#F7931A] font-mono">{EMERGENCY_CONTACTS.transportManager.phone}</p>
                  </div>
                </a>

                <a
                  href={`tel:${assignedBus.driverPhone}`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F7931A]/60 flex items-center gap-3 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#EA580C]/20 text-[#EA580C] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Driver ({assignedBus.driverName})</p>
                    <p className="text-[10px] text-[#EA580C] font-mono">{assignedBus.driverPhone}</p>
                  </div>
                </a>

                <a
                  href={`tel:${EMERGENCY_CONTACTS.campusSecurity.phone}`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/50 flex items-center gap-3 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Campus Security 24/7</p>
                    <p className="text-[10px] text-red-300 font-mono">{EMERGENCY_CONTACTS.campusSecurity.phone}</p>
                  </div>
                </a>

                <a
                  href={`tel:${EMERGENCY_CONTACTS.medicalCentre.ambulance}`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/50 flex items-center gap-3 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Ambulance className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Medical Ambulance</p>
                    <p className="text-[10px] text-rose-300 font-mono">Dial 108 / Clinic Ext</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Broadcast SOS Form */}
            <form onSubmit={handleBroadcast} className="space-y-4 pt-2 border-t border-white/10">
              <p className="text-xs font-mono uppercase text-[#94A3B8] tracking-wider">
                Broadcast Rapid SOS Notice
              </p>

              <div>
                <label className="text-xs text-[#94A3B8] block mb-2 font-mono">Select Issue Category:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'MEDICAL', label: 'Medical Aid' },
                    { id: 'BREAKDOWN', label: 'Bus Breakdown' },
                    { id: 'OVERCROWD', label: 'Overcrowd Buffer' },
                    { id: 'SECURITY', label: 'Security / Help' },
                    { id: 'ACCIDENT', label: 'Traffic Block' }
                  ].map(item => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedReason(item.id)}
                      className={`p-2 rounded-xl text-xs font-mono text-center border transition-all ${
                        selectedReason === item.id
                          ? 'bg-[#EA580C]/20 border-[#EA580C] text-[#FFD600] font-bold shadow-[0_0_15px_rgba(234,88,12,0.3)]'
                          : 'bg-black/50 border-white/10 text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#94A3B8] block mb-1 font-mono">
                  Additional Details / Landmark (Optional):
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Near Science Quad, bus stopped due to tyre issue..."
                  className="w-full bg-black/50 border-b-2 border-white/20 focus:border-[#EA580C] px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-xs font-mono text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_20px_-5px_rgba(234,88,12,0.6)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Broadcast Live SOS Alert
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
