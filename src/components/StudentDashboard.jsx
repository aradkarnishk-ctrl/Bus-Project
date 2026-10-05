import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LiveMap from './LiveMap';
import {
  Bus,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  Shield,
  QrCode,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Compass,
  Zap,
  PhoneCall,
  XCircle,
  HelpCircle
} from 'lucide-react';

export default function StudentDashboard({ onOpenEmergency }) {
  const {
    currentUser,
    buses,
    selectedBusId,
    setSelectedBusId,
    bookings,
    bookSeat,
    cancelBooking
  } = useApp();

  const [activeTab, setActiveTab] = useState('book'); // 'book', 'live', 'passes', 'profile'
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('North Star Hostel A Gate');
  const [dropLocation, setDropLocation] = useState('Main Campus Admin & Tech Tower');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const activeBus = buses.find(b => b.id === selectedBusId) || buses[0];
  const userBookings = bookings.filter(b => b.studentId === currentUser?.id);
  const seatsLeft = activeBus.capacity - activeBus.bookedSeats.length;

  const handleSeatClick = (seatNum) => {
    if (activeBus.bookedSeats.includes(seatNum)) return;
    setSelectedSeat(seatNum === selectedSeat ? null : seatNum);
  };

  const handleConfirmBooking = () => {
    if (!selectedSeat) return;
    const res = bookSeat(activeBus.id, selectedSeat, pickupLocation, dropLocation);
    if (res.success) {
      setIsBookingSuccess(true);
      setSelectedSeat(null);
      setTimeout(() => {
        setIsBookingSuccess(false);
        setActiveTab('passes');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Telemetry Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-5 sm:p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-[#F7931A] tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" /> Student Transit Portal
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
            Welcome back, <span className="bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent">{currentUser?.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-mono mt-1">
            Roll: {currentUser?.rollNo || 'CS23B104'} • Assigned: {currentUser?.hostel || 'Hostel Block A'}
          </p>
        </div>

        {/* Quick ETA Badge */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#030304] border border-white/10 text-right">
            <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Next Bus to Campus</p>
            <p className="font-heading font-bold text-xl text-[#FFD600] flex items-center gap-1.5 justify-end">
              <Clock className="w-4 h-4 text-[#F7931A]" />
              {activeBus.etaMinutes} mins
            </p>
          </div>

          <button
            onClick={onOpenEmergency}
            className="px-4 py-3 rounded-xl bg-[#EA580C]/20 border border-[#EA580C]/60 text-[#EA580C] hover:bg-[#EA580C] hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(234,88,12,0.3)] cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">SOS</span> Help
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-2">
        {[
          { id: 'book', label: 'Book Your Bus', icon: Bus },
          { id: 'live', label: 'Live Map & ETA', icon: MapPin },
          { id: 'passes', label: `My Bookings (${userBookings.length})`, icon: QrCode },
          { id: 'profile', label: 'Profile', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] font-bold'
                  : 'bg-[#0F1115] text-[#94A3B8] hover:text-white border border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOK YOUR BUS & SEAT SELECTION */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bus Cards List (Left Column) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-heading font-semibold text-base text-white flex items-center justify-between">
              <span>Select Available Campus Bus</span>
              <span className="text-xs font-mono text-[#94A3B8]">{buses.length} Active Shuttles</span>
            </h2>

            <div className="space-y-3">
              {buses.map(bus => {
                const isSelected = bus.id === selectedBusId;
                const freeSeats = bus.capacity - bus.bookedSeats.length;
                const isFull = freeSeats <= 0;

                return (
                  <div
                    key={bus.id}
                    onClick={() => { setSelectedBusId(bus.id); setSelectedSeat(null); }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F1115] border-[#F7931A] shadow-[0_0_25px_rgba(247,147,26,0.25)]'
                        : 'bg-[#0F1115]/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                          isSelected ? 'bg-gradient-to-br from-[#EA580C] to-[#F7931A] text-white' : 'bg-white/5 text-[#94A3B8]'
                        }`}>
                          #{bus.number}
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-white text-sm">{bus.name}</h3>
                          <p className="text-xs text-[#94A3B8] font-mono">{bus.routeName}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isFull
                            ? 'bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/50'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {isFull ? 'FULL (BUFFER OPEN)' : `${freeSeats} SEATS LEFT`}
                        </span>
                        <p className="text-[11px] text-[#FFD600] font-mono mt-1">ETA: {bus.etaMinutes} mins</p>
                      </div>
                    </div>

                    {/* Bus Route Stops Ticker */}
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#F7931A]" />
                        Next: <strong className="text-white">{bus.nextStop}</strong>
                      </span>
                      <span>Speed: {bus.speed} km/h</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pickup & Drop Selection */}
            <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
              <h3 className="font-heading font-semibold text-xs uppercase text-[#94A3B8] tracking-wider">
                Select Route Boarding Point
              </h3>

              <div>
                <label className="text-[11px] font-mono text-[#94A3B8] block mb-1">Pickup Stop:</label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-[#030304] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#F7931A] focus:outline-none"
                >
                  <option value="North Star Hostel A Gate">North Star Hostel A Gate</option>
                  <option value="Emerald Woods Hostel B">Emerald Woods Hostel B</option>
                  <option value="Skyline Heights Hostel C">Skyline Heights Hostel C</option>
                  <option value="University Sports Complex">University Sports Complex</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#94A3B8] block mb-1">Drop Stop:</label>
                <select
                  value={dropLocation}
                  onChange={(e) => setDropLocation(e.target.value)}
                  className="w-full bg-[#030304] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-[#F7931A] focus:outline-none"
                >
                  <option value="Main Campus Admin & Tech Tower">Main Campus Admin & Tech Tower</option>
                  <option value="Science & Biotech Hub">Science & Biotech Hub</option>
                  <option value="Central Library & Quad">Central Library & Quad</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Seat Selection Grid (Right Column) */}
          <div className="lg:col-span-7 glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  Seat Layout: {activeBus.name}
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono">
                  {seatsLeft} available of {activeBus.capacity} passenger seats
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-[#030304] border border-white/20" />
                  <span className="text-[#94A3B8]">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-gradient-to-r from-[#EA580C] to-[#F7931A] shadow-[0_0_8px_#F7931A]" />
                  <span className="text-[#F7931A]">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-white/10 text-white/40 opacity-50" />
                  <span className="text-[#94A3B8]">Booked</span>
                </div>
              </div>
            </div>

            {/* Bus Cabin Blueprint Layout */}
            <div className="max-w-md mx-auto p-4 sm:p-6 rounded-3xl bg-[#030304] border-2 border-white/10 shadow-inner">
              {/* Bus Windshield & Driver Cab */}
              <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-4">
                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-[#94A3B8]">
                  🚌 FRONT WINDSHIELD
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EA580C]/20 border border-[#EA580C]/50 text-[11px] font-mono text-[#FFD600]">
                  <User className="w-3 h-3 text-[#EA580C]" /> Driver ({activeBus.driverName?.split(' ')[0]})
                </div>
              </div>

              {/* 2x2 Seating Grid with Center Aisle */}
              <div className="space-y-2.5">
                {Array.from({ length: Math.ceil(activeBus.capacity / 4) }).map((_, rowIndex) => {
                  const s1 = rowIndex * 4 + 1;
                  const s2 = rowIndex * 4 + 2;
                  const s3 = rowIndex * 4 + 3;
                  const s4 = rowIndex * 4 + 4;

                  const renderSeat = (num) => {
                    if (num > activeBus.capacity) return <div key={num} className="w-9 sm:w-11 h-9 sm:h-11" />;

                    const isBooked = activeBus.bookedSeats.includes(num);
                    const isSelected = selectedSeat === num;

                    return (
                      <button
                        key={num}
                        disabled={isBooked}
                        onClick={() => handleSeatClick(num)}
                        className={`w-9 sm:w-11 h-9 sm:h-11 rounded-xl text-xs font-mono font-bold transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_15px_#F7931A] scale-105 border border-white'
                            : isBooked
                            ? 'bg-white/5 text-white/30 cursor-not-allowed border border-transparent'
                            : 'bg-[#0F1115] text-white border border-white/20 hover:border-[#F7931A] hover:shadow-[0_0_10px_rgba(247,147,26,0.3)] cursor-pointer'
                        }`}
                      >
                        <span>{num}</span>
                      </button>
                    );
                  };

                  return (
                    <div key={rowIndex} className="flex items-center justify-between">
                      {/* Left Pair */}
                      <div className="flex items-center gap-2">
                        {renderSeat(s1)}
                        {renderSeat(s2)}
                      </div>

                      {/* Center Aisle Indicator */}
                      <span className="text-[9px] font-mono text-white/20">AISLE</span>

                      {/* Right Pair */}
                      <div className="flex items-center gap-2">
                        {renderSeat(s3)}
                        {renderSeat(s4)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rear Door / Emergency Exit */}
              <div className="pt-4 mt-4 border-t border-white/10 text-center text-[10px] font-mono text-[#94A3B8]">
                🚪 REAR ENTRY & EMERGENCY EXIT
              </div>
            </div>

            {/* Booking Confirmation Bar */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#94A3B8] font-mono">
                  {selectedSeat ? (
                    <span>
                      Selected Seat: <strong className="text-[#FFD600] font-bold text-sm">#{selectedSeat}</strong> on {activeBus.name}
                    </span>
                  ) : (
                    <span>Click any available seat above to select</span>
                  )}
                </p>
                <p className="text-[11px] text-[#94A3B8]">
                  Route: {pickupLocation} → {dropLocation}
                </p>
              </div>

              <button
                disabled={!selectedSeat || seatsLeft <= 0}
                onClick={handleConfirmBooking}
                className={`w-full sm:w-auto px-8 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  selectedSeat && seatsLeft > 0
                    ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_25px_rgba(247,147,26,0.6)] hover:scale-105 cursor-pointer'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {seatsLeft <= 0 ? 'Bus Full (Check Driver)' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE MAP & ETA */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Active Route Loop</p>
              <h4 className="font-heading font-bold text-white text-base mt-1">{activeBus.routeName}</h4>
              <p className="text-xs text-[#F7931A] font-mono mt-0.5">Round #{activeBus.currentRound} in progress</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Live Arrival ETA</p>
              <h4 className="font-heading font-bold text-[#FFD600] text-xl mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F7931A]" />
                {activeBus.etaMinutes} Minutes
              </h4>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">Next Stop: {activeBus.nextStop}</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-mono uppercase text-[#94A3B8]">Driver Contact</p>
              <h4 className="font-heading font-bold text-white text-base mt-1">{activeBus.driverName}</h4>
              <a
                href={`tel:${activeBus.driverPhone}`}
                className="text-xs text-[#F7931A] font-mono hover:underline flex items-center gap-1 mt-0.5"
              >
                <PhoneCall className="w-3 h-3" /> {activeBus.driverPhone}
              </a>
            </div>
          </div>

          {/* Real-time Map */}
          <LiveMap height="480px" highlightBusId={selectedBusId} />
        </div>
      )}

      {/* TAB 3: MY BOARDING PASSES & BOOKINGS */}
      {activeTab === 'passes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-xl text-white">
              My Active Bus Boarding Passes
            </h2>
            <span className="text-xs font-mono text-[#94A3B8]">
              {userBookings.length} Active {userBookings.length === 1 ? 'Ticket' : 'Tickets'}
            </span>
          </div>

          {userBookings.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl border border-white/10 space-y-3">
              <Bus className="w-12 h-12 text-[#94A3B8] mx-auto opacity-40" />
              <h3 className="font-heading font-semibold text-lg text-white">No Active Bus Bookings</h3>
              <p className="text-xs text-[#94A3B8] font-mono max-w-sm mx-auto">
                You haven’t reserved a seat on any upcoming campus bus. Click "Book Your Bus" to secure your seat.
              </p>
              <button
                onClick={() => setActiveTab('book')}
                className="mt-2 px-6 py-2 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white"
              >
                Book a Seat Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map(pass => (
                <div
                  key={pass.id}
                  className="rounded-3xl bg-[#0F1115] border border-white/15 p-6 space-y-5 relative overflow-hidden shadow-[0_0_35px_rgba(247,147,26,0.15)] group hover:border-[#F7931A]/60 transition-all"
                >
                  {/* Decorative glowing corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#F7931A]/20 to-transparent pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center text-white font-mono font-bold">
                        #{pass.busNumber}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-white text-base">{pass.busName}</h3>
                        <p className="text-xs text-[#94A3B8] font-mono">Pass #{pass.id}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                      {pass.status}
                    </span>
                  </div>

                  {/* Ticket Details */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-[#030304] p-3 rounded-xl border border-white/5">
                      <p className="text-[#94A3B8] text-[10px]">SEAT NUMBER</p>
                      <p className="text-2xl font-heading font-bold text-[#FFD600]">Seat {pass.seatNumber}</p>
                    </div>

                    <div className="bg-[#030304] p-3 rounded-xl border border-white/5">
                      <p className="text-[#94A3B8] text-[10px]">DEPARTURE TIME</p>
                      <p className="text-lg font-heading font-bold text-white">{pass.tripTime}</p>
                    </div>
                  </div>

                  {/* Route points */}
                  <div className="space-y-2 text-xs font-mono bg-[#030304] p-3.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#F7931A]" />
                      <span className="text-[#94A3B8]">Pickup:</span>
                      <span className="text-white font-medium truncate">{pass.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FFD600]" />
                      <span className="text-[#94A3B8]">Drop:</span>
                      <span className="text-white font-medium truncate">{pass.drop}</span>
                    </div>
                  </div>

                  {/* QR Simulation & Verification string */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#94A3B8]">
                      <QrCode className="w-5 h-5 text-[#FFD600]" />
                      <span>Scan during Driver Boarding</span>
                    </div>

                    {/* Cancel Seat Button */}
                    <button
                      onClick={() => cancelBooking(pass.id)}
                      className="px-4 py-2 rounded-full text-xs font-mono text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Seat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STUDENT PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center text-white font-heading font-bold text-2xl shadow-[0_0_20px_#F7931A]">
              {currentUser?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-white">{currentUser?.name}</h2>
              <p className="text-xs text-[#F7931A] font-mono">{currentUser?.rollNo} • {currentUser?.department}</p>
              <p className="text-xs text-[#94A3B8] font-mono">{currentUser?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#030304] border border-white/10">
              <span className="text-[#94A3B8] text-[10px] block">HOSTEL ALLOTMENT</span>
              <span className="text-white font-semibold text-sm">{currentUser?.hostel}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#030304] border border-white/10">
              <span className="text-[#94A3B8] text-[10px] block">DORM ROOM NO.</span>
              <span className="text-white font-semibold text-sm">{currentUser?.roomNo || 'A-312'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#030304] border border-white/10">
              <span className="text-[#94A3B8] text-[10px] block">REGISTERED PHONE</span>
              <span className="text-white font-semibold text-sm">{currentUser?.phone}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#030304] border border-white/10">
              <span className="text-[#94A3B8] text-[10px] block">ACADEMIC YEAR</span>
              <span className="text-white font-semibold text-sm">{currentUser?.year || '3rd Year B.Tech'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-[#94A3B8]">Campus Transport ID Verified</span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              ACTIVE PASS
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
