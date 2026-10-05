import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LiveMap from './LiveMap';
import {
  Shield,
  Bus,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Filter,
  Flame,
  Radio,
  ExternalLink,
  Edit2
} from 'lucide-react';

export default function AdminDashboard({ onOpenEmergency }) {
  const {
    buses,
    bookings,
    emergencies,
    resolveEmergency,
    addBus,
    deleteBus,
    toggleBusStatus,
    cancelBooking
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState('fleet'); // 'fleet', 'bookings', 'routes', 'emergencies'
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBus, setFilterBus] = useState('ALL');

  // Form state for adding new bus
  const [newBusName, setNewBusName] = useState('');
  const [newBusCapacity, setNewBusCapacity] = useState('32');
  const [newBusDriver, setNewBusDriver] = useState('');
  const [newBusReg, setNewBusReg] = useState('');
  const [newBusRoute, setNewBusRoute] = useState('Hostel A ↔ Campus Main');

  // Fleet Calculations
  const totalBuses = buses.length;
  const runningBuses = buses.filter(b => b.status === 'RUNNING').length;
  const totalBookedSeats = buses.reduce((acc, b) => acc + b.bookedSeats.length, 0);
  const totalCapacity = buses.reduce((acc, b) => acc + b.capacity, 0);
  const totalBuffer = buses.reduce((acc, b) => acc + (b.bufferCount || 0), 0);
  const activeEmergencies = emergencies.filter(e => e.status === 'ACTIVE');

  const filteredBookings = bookings.filter(b => {
    const matchesBus = filterBus === 'ALL' || b.busId === filterBus;
    const matchesSearch =
      b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBus && matchesSearch;
  });

  const handleCreateBus = (e) => {
    e.preventDefault();
    if (!newBusName) return;

    addBus({
      name: newBusName,
      capacity: newBusCapacity,
      driverName: newBusDriver || 'Campus Transit Driver',
      registration: newBusReg || `KA-01-EB-${Math.floor(1000 + Math.random() * 9000)}`,
      routeName: newBusRoute
    });

    setNewBusName('');
    setNewBusDriver('');
    setNewBusReg('');
    setShowAddBusModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-[#F7931A] font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#FFD600]" /> Transport Command & Fleet Operations
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
            Campus Transit Fleet HQ
          </h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            Real-time GPS Monitoring, Booking Allocations & Driver Management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddBusModal(true)}
            className="px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_20px_rgba(247,147,26,0.5)] hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Deploy New Bus
          </button>
        </div>
      </div>

      {/* Fleet Overview Telemetry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Active Shuttles</p>
          <p className="font-heading font-bold text-2xl text-white mt-1">
            {runningBuses} <span className="text-xs font-mono text-[#94A3B8]">/ {totalBuses} Active</span>
          </p>
          <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${(runningBuses / totalBuses) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Passenger Load</p>
          <p className="font-heading font-bold text-2xl text-[#FFD600] mt-1">
            {totalBookedSeats} <span className="text-xs font-mono text-[#94A3B8]">/ {totalCapacity} Seats</span>
          </p>
          <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#FFD600] h-full rounded-full"
              style={{ width: `${(totalBookedSeats / totalCapacity) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Buffer Standby Count</p>
          <p className="font-heading font-bold text-2xl text-[#F7931A] mt-1">
            {totalBuffer} <span className="text-xs font-mono text-[#94A3B8]">Passengers</span>
          </p>
          <p className="text-[11px] text-[#94A3B8] font-mono mt-2">Standing permits allotted</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Emergency Incidents</p>
          <p className={`font-heading font-bold text-2xl mt-1 ${activeEmergencies.length > 0 ? 'text-[#EA580C] animate-pulse' : 'text-emerald-400'}`}>
            {activeEmergencies.length} <span className="text-xs font-mono text-[#94A3B8]">Active SOS</span>
          </p>
          <p className="text-[11px] text-[#94A3B8] font-mono mt-2">
            {activeEmergencies.length > 0 ? 'Urgent attention required' : 'All clear & nominal'}
          </p>
        </div>
      </div>

      {/* Fleet Command Central Live Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#F7931A]" />
            Fleet Central Live Radar
          </h2>
          <span className="text-xs font-mono text-[#94A3B8]">All 3 GPS Trackers Live</span>
        </div>
        <LiveMap height="380px" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'fleet', label: 'Buses & Fleet Management' },
          { id: 'bookings', label: `Student Bookings (${bookings.length})` },
          { id: 'emergencies', label: `Incident Log (${emergencies.length})` },
          { id: 'routes', label: 'Routes & Hostel Schedules' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
              activeAdminTab === tab.id
                ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_15px_rgba(247,147,26,0.5)] font-bold'
                : 'bg-[#0F1115] text-[#94A3B8] hover:text-white border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: FLEET & BUSES MANAGEMENT */}
      {activeAdminTab === 'fleet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buses.map(bus => {
              const freeSeats = bus.capacity - bus.bookedSeats.length;
              const isRunning = bus.status === 'RUNNING';

              return (
                <div
                  key={bus.id}
                  className="rounded-2xl bg-[#0F1115] border border-white/10 p-5 space-y-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:border-[#F7931A]/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#FFD600]">BUS #{bus.number}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#94A3B8]">
                          {bus.registration}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-white text-base mt-1">{bus.name}</h3>
                      <p className="text-xs text-[#94A3B8] font-mono">{bus.routeName}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                      isRunning
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-950 text-red-400 border border-red-500/40'
                    }`}>
                      {isRunning ? 'GPS ACTIVE' : 'STOPPED'}
                    </span>
                  </div>

                  {/* Telemetry info */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#030304] p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[#94A3B8] text-[10px] block">DRIVER</span>
                      <span className="text-white font-medium truncate block">{bus.driverName}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] text-[10px] block">CAPACITY</span>
                      <span className="text-[#FFD600] font-bold">{bus.bookedSeats.length} / {bus.capacity}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] text-[10px] block">BUFFER STANDBY</span>
                      <span className="text-white">{bus.bufferCount || 0} / 5</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] text-[10px] block">NEXT STOP</span>
                      <span className="text-white truncate block">{bus.nextStop}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <button
                      onClick={() => toggleBusStatus(bus.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                        isRunning
                          ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black'
                      }`}
                    >
                      {isRunning ? 'Pause GPS' : 'Resume GPS'}
                    </button>

                    <button
                      onClick={() => deleteBus(bus.id)}
                      className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                      title="Retire bus from active fleet"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Retire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS & PASSENGERS */}
      {activeAdminTab === 'bookings' && (
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or roll no..."
                className="w-full bg-[#030304] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-[#F7931A] focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#94A3B8]">Filter Bus:</span>
              <select
                value={filterBus}
                onChange={(e) => setFilterBus(e.target.value)}
                className="bg-[#030304] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:border-[#F7931A] focus:outline-none"
              >
                <option value="ALL">All Fleet Buses</option>
                {buses.map(b => (
                  <option key={b.id} value={b.id}>Bus {b.number} ({b.name})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#030304] text-[#94A3B8] border-b border-white/10 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Bus</th>
                  <th className="p-3">Seat</th>
                  <th className="p-3">Route Stops</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-[#94A3B8]">
                      No passenger bookings found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map(bk => (
                    <tr key={bk.id} className="hover:bg-white/5">
                      <td className="p-3 font-bold text-[#FFD600]">{bk.id}</td>
                      <td className="p-3 font-semibold text-white">{bk.studentName}</td>
                      <td className="p-3 text-[#94A3B8]">{bk.studentRoll}</td>
                      <td className="p-3 text-white">Bus #{bk.busNumber}</td>
                      <td className="p-3 font-bold text-[#F7931A]">Seat {bk.seatNumber}</td>
                      <td className="p-3 text-[#94A3B8] max-w-xs truncate">
                        {bk.pickup} → {bk.drop}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px]">
                          {bk.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => cancelBooking(bk.id)}
                          className="text-red-400 hover:text-red-300 hover:underline"
                        >
                          Revoke Seat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY INCIDENT LOG */}
      {activeAdminTab === 'emergencies' && (
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">
              Campus SOS & Incident Log
            </h3>
            <span className="text-xs font-mono text-[#94A3B8]">
              {emergencies.length} Logged Alerts
            </span>
          </div>

          <div className="space-y-3">
            {emergencies.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#94A3B8]">
                No emergency incidents logged. Fleet is running safely.
              </div>
            ) : (
              emergencies.map(emg => (
                <div
                  key={emg.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    emg.status === 'ACTIVE'
                      ? 'bg-[#EA580C]/15 border-[#EA580C] text-white shadow-[0_0_20px_rgba(234,88,12,0.25)]'
                      : 'bg-[#030304] border-white/10 text-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#EA580C] text-white mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">#{emg.id}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#FFD600] border border-white/10">
                          {emg.type}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] font-mono">{emg.timestamp}</span>
                      </div>
                      <p className="text-xs font-semibold text-white mt-1">{emg.message}</p>
                      <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                        Reported by: <strong className="text-white">{emg.senderName}</strong> • Location: {emg.location}
                      </p>
                    </div>
                  </div>

                  <div>
                    {emg.status === 'ACTIVE' ? (
                      <button
                        onClick={() => resolveEmergency(emg.id)}
                        className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-[0_0_12px_#10B981] cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> RESOLVED
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ROUTES & HOSTEL SCHEDULES */}
      {activeAdminTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#F7931A] font-bold">ROUTE 01</span>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded">Every 15 mins</span>
            </div>
            <h4 className="font-heading font-bold text-white text-base">North Star Hostel A Express</h4>
            <p className="text-xs text-[#94A3B8] font-mono">
              Hostel A Gate → Sports Complex → Science Block → Tech Tower
            </p>
            <div className="pt-2 border-t border-white/10 text-xs font-mono text-[#FFD600]">
              Assigned: Bus #01 (Falcon Express)
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#FFD600] font-bold">ROUTE 02</span>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded">Every 20 mins</span>
            </div>
            <h4 className="font-heading font-bold text-white text-base">Emerald Woods Hostel B Shuttle</h4>
            <p className="text-xs text-[#94A3B8] font-mono">
              Hostel B → Metro Interchange → South Tech Park → Main Campus
            </p>
            <div className="pt-2 border-t border-white/10 text-xs font-mono text-[#FFD600]">
              Assigned: Bus #02 (Solaris Shuttle)
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#EA580C] font-bold">ROUTE 03</span>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded">Every 12 mins</span>
            </div>
            <h4 className="font-heading font-bold text-white text-base">Skyline Heights Hostel C Rapid</h4>
            <p className="text-xs text-[#94A3B8] font-mono">
              Hostel C → North Boulevard → Central Library → Engineering Quad
            </p>
            <div className="pt-2 border-t border-white/10 text-xs font-mono text-[#FFD600]">
              Assigned: Bus #03 (Titan Rapid)
            </div>
          </div>
        </div>
      )}

      {/* Modal: Deploy New Bus */}
      {showAddBusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0F1115] border border-white/15 p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Bus className="w-5 h-5 text-[#F7931A]" />
              Deploy New College Bus
            </h3>
            <p className="text-xs text-[#94A3B8] font-mono">
              Add a smart transit bus to the GPS tracking and booking roster.
            </p>

            <form onSubmit={handleCreateBus} className="space-y-3">
              <div>
                <label className="text-xs text-[#94A3B8] font-mono block mb-1">Bus Fleet Name:</label>
                <input
                  type="text"
                  required
                  value={newBusName}
                  onChange={(e) => setNewBusName(e.target.value)}
                  placeholder="e.g. Phoenix Express 04"
                  className="w-full bg-[#030304] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F7931A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#94A3B8] font-mono block mb-1">Seating Capacity:</label>
                  <input
                    type="number"
                    min="16"
                    max="60"
                    value={newBusCapacity}
                    onChange={(e) => setNewBusCapacity(e.target.value)}
                    className="w-full bg-[#030304] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F7931A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#94A3B8] font-mono block mb-1">License Plate:</label>
                  <input
                    type="text"
                    value={newBusReg}
                    onChange={(e) => setNewBusReg(e.target.value)}
                    placeholder="KA-01-EB-8801"
                    className="w-full bg-[#030304] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F7931A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#94A3B8] font-mono block mb-1">Assigned Driver Name:</label>
                <input
                  type="text"
                  value={newBusDriver}
                  onChange={(e) => setNewBusDriver(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-[#030304] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F7931A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#94A3B8] font-mono block mb-1">Assigned Route:</label>
                <select
                  value={newBusRoute}
                  onChange={(e) => setNewBusRoute(e.target.value)}
                  className="w-full bg-[#030304] border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-[#F7931A] focus:outline-none font-mono"
                >
                  <option value="Hostel A ↔ Campus Main">Hostel A ↔ Campus Main</option>
                  <option value="Hostel B ↔ Campus Tech Park">Hostel B ↔ Campus Tech Park</option>
                  <option value="Hostel C ↔ Engineering Hub">Hostel C ↔ Engineering Hub</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_15px_#F7931A]"
                >
                  Confirm Fleet Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
