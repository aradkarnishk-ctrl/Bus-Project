import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LiveMap from './LiveMap';
import {
  Bus,
  Play,
  Square,
  Users,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  UserPlus,
  Trash2,
  Radio,
  Gauge,
  PhoneCall,
  Bell,
  ArrowRight,
  ShieldAlert,
  Flame
} from 'lucide-react';

export default function DriverDashboard({ onOpenEmergency }) {
  const {
    currentUser,
    buses,
    bookings,
    toggleBusStatus,
    addBufferStudent,
    removeBufferStudent,
    emergencies
  } = useApp();

  // Find driver's assigned bus (defaults to BUS-01)
  const driverBus = buses.find(b => b.driverId === currentUser?.id) || buses[0];
  const busBookings = bookings.filter(b => b.busId === driverBus.id);

  const [boardedStudents, setBoardedStudents] = useState({});
  const [newBufferName, setNewBufferName] = useState('');
  const [newBufferRoll, setNewBufferRoll] = useState('');
  const [showAddBufferModal, setShowAddBufferModal] = useState(false);

  const isRunning = driverBus.status === 'RUNNING';
  const totalBooked = driverBus.bookedSeats.length;
  const seatsLeft = driverBus.capacity - totalBooked;
  const isFull = seatsLeft <= 0;
  const bufferCount = driverBus.bufferCount || 0;
  const maxBuffer = driverBus.bufferLimit || 5;

  const toggleBoarding = (bookingId) => {
    setBoardedStudents(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const handleAddBuffer = (e) => {
    e.preventDefault();
    if (!newBufferName) return;

    addBufferStudent(driverBus.id, {
      id: 'buf-' + Date.now(),
      name: newBufferName,
      rollNo: newBufferRoll || 'WALK-IN',
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'STANDBY_BOARDED'
    });

    setNewBufferName('');
    setNewBufferRoll('');
    setShowAddBufferModal(false);
  };

  return (
    <div className="space-y-6">
      {/* FULL BUS NOTIFICATION BANNER */}
      {isFull && (
        <div className="rounded-2xl bg-[#EA580C]/25 border-2 border-[#EA580C] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_30px_rgba(234,88,12,0.4)] animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base">
                BUS CAPACITY FULL ({totalBooked}/{driverBus.capacity} SEATS BOOKED)
              </h3>
              <p className="text-xs text-[#FFD600] font-mono">
                All regular seats are filled. Buffer standing queue active (Up to 5 buffer passengers allowed).
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-black/60 text-[#FFD600] border border-[#FFD600]/40 text-xs font-mono font-bold">
            Buffer Standby: {bufferCount} / {maxBuffer}
          </div>
        </div>
      )}

      {/* Driver Console Header Card */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center text-white shadow-[0_0_20px_#F7931A]">
              <Bus className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#F7931A] font-bold">
                  Cockpit Control
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                  Reg: {driverBus.registration}
                </span>
              </div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                {driverBus.name}
              </h1>
              <p className="text-xs text-[#94A3B8] font-mono">
                Driver: <strong className="text-white">{currentUser?.name}</strong> • Route: {driverBus.routeName}
              </p>
            </div>
          </div>

          {/* Large Start / Stop Button & SOS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleBusStatus(driverBus.id)}
              className={`px-6 py-3.5 rounded-full font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 cursor-pointer ${isRunning
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-105'
                  : 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_25px_rgba(234,88,12,0.6)] hover:scale-105'
                }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  Stop Bus (Halt GPS)
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Start Bus (Resume GPS)
                </>
              )}
            </button>

            <button
              onClick={onOpenEmergency}
              className="px-4 py-3.5 rounded-full bg-[#EA580C]/20 border border-[#EA580C] text-[#EA580C] hover:bg-[#EA580C] hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(234,88,12,0.3)] cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Driver</span> SOS
            </button>
          </div>
        </div>

        {/* Live Trip Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10">
          <div className="p-3 rounded-xl bg-[#030304] border border-white/5">
            <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Trip Status</p>
            <p className="font-heading font-bold text-sm text-white flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
              {isRunning ? 'RUNNING' : 'STOPPED'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#030304] border border-white/5">
            <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Round Count</p>
            <p className="font-heading font-bold text-sm text-[#FFD600] mt-0.5">
              Round #{driverBus.currentRound}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#030304] border border-white/5">
            <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Next Stop ETA</p>
            <p className="font-heading font-bold text-sm text-[#F7931A] mt-0.5">
              {driverBus.etaMinutes} mins
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#030304] border border-white/5">
            <p className="text-[10px] font-mono uppercase text-[#94A3B8]">College Arrival</p>
            <p className="font-heading font-bold text-sm text-white mt-0.5">
              {driverBus.collegeArrivalTime}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#030304] border border-white/5">
            <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Hostel Arrival</p>
            <p className="font-heading font-bold text-sm text-white mt-0.5">
              {driverBus.hostelArrivalTime}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#030304] border border-white/5">
            <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Current Speed</p>
            <p className="font-heading font-bold text-sm text-emerald-400 mt-0.5 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              {driverBus.speed} km/h
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Buffer Students + Manifest + Live Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Buffer Students & Manifest (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Buffer Students Manager (Up to 5 buffer students) */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#F7931A]" />
                  Buffer Standby Students Manager
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono">
                  Allowed capacity: Up to 5 buffer standby students ({bufferCount}/{maxBuffer} active)
                </p>
              </div>

              <button
                disabled={bufferCount >= maxBuffer}
                onClick={() => setShowAddBufferModal(true)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${bufferCount < maxBuffer
                    ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_15px_rgba(247,147,26,0.4)] hover:scale-105'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                + Add Buffer
              </button>
            </div>

            {/* Buffer visual slots */}
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, idx) => {
                const student = driverBus.bufferStudents?.[idx];
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-center font-mono ${student
                        ? 'bg-[#EA580C]/15 border-[#EA580C]/50 text-white shadow-[0_0_10px_rgba(234,88,12,0.2)]'
                        : 'bg-[#030304] border-white/10 text-[#94A3B8]/40'
                      }`}
                  >
                    <p className="text-[9px] uppercase">Buffer #{idx + 1}</p>
                    <p className="text-xs font-bold truncate mt-1">
                      {student ? student.name.split(' ')[0] : 'Open'}
                    </p>
                    {student && (
                      <button
                        onClick={() => removeBufferStudent(driverBus.id, student.id)}
                        className="text-[9px] text-red-400 hover:text-red-300 mt-1"
                        title="Remove buffer student"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Passenger Manifest & Booked Seats */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  Student Passenger Manifest
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono">
                  {totalBooked} Confirmed Seats • {seatsLeft} Vacant Seats
                </p>
              </div>
              <span className="text-xs font-mono text-[#F7931A]">
                Tap checkmark to verify boarding
              </span>
            </div>

            {/* Passenger list */}
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {busBookings.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[#94A3B8]">
                  No student bookings recorded yet on this bus.
                </div>
              ) : (
                busBookings.map(bk => {
                  const isBoarded = boardedStudents[bk.id];
                  return (
                    <div
                      key={bk.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${isBoarded
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-[#030304] border-white/10 text-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-[#FFD600]">
                          #{bk.seatNumber}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-2">
                            {bk.studentName}
                            <span className="text-[10px] text-[#94A3B8] font-mono">{bk.studentRoll}</span>
                          </p>
                          <p className="text-[11px] text-[#94A3B8] font-mono">
                            {bk.pickup} → {bk.drop}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleBoarding(bk.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${isBoarded
                            ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_#10B981]'
                            : 'bg-white/10 text-[#94A3B8] hover:text-white hover:border-[#F7931A]'
                          }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isBoarded ? 'BOARDED' : 'MARK BOARD'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Fleet Radar & Other Buses (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#FFD600]" />
                Fleet Radar & Other Buses
              </h3>
              <span className="text-[10px] font-mono text-[#94A3B8]">
                Your Bus: <strong className="text-[#FFD600]">#{driverBus.number}</strong>
              </span>
            </div>

            <LiveMap height="360px" highlightBusId={driverBus.id} showControls={false} />

            {/* Other Buses Status */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-mono uppercase text-[#94A3B8]">Active Campus Fleet Status</p>
              {buses.map(b => (
                <div
                  key={b.id}
                  className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${b.id === driverBus.id
                      ? 'bg-[#F7931A]/10 border-[#F7931A]/40 text-white'
                      : 'bg-[#030304] border-white/10 text-[#94A3B8]'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${b.status === 'RUNNING' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="font-bold text-white">{b.name}</span>
                    {b.id === driverBus.id && (
                      <span className="text-[9px] bg-[#FFD600] text-black px-1.5 rounded font-bold">YOU</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-white">{b.speed} km/h</span> • <span>ETA {b.etaMinutes}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Buffer Student */}
      {showAddBufferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0F1115] border border-white/15 p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#F7931A]" />
              Add Buffer Standby Student
            </h3>
            <p className="text-xs text-[#94A3B8] font-mono">
              Register a standing passenger (maximum 5 buffer slots permitted by campus policy).
            </p>

            <form onSubmit={handleAddBuffer} className="space-y-3">
              <div>
                <label className="text-xs text-[#94A3B8] font-mono block mb-1">Student Full Name:</label>
                <input
                  type="text"
                  required
                  value={newBufferName}
                  onChange={(e) => setNewBufferName(e.target.value)}
                  placeholder="e.g. Sneha Kulkarni"
                  className="w-full bg-[#030304] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F7931A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#94A3B8] font-mono block mb-1">Student Roll Number / Dept:</label>
                <input
                  type="text"
                  value={newBufferRoll}
                  onChange={(e) => setNewBufferRoll(e.target.value)}
                  placeholder="e.g. CS24B088"
                  className="w-full bg-[#030304] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F7931A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBufferModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_15px_#F7931A]"
                >
                  Authorize Buffer Boarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
