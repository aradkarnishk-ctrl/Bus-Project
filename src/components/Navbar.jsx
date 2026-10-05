import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bus,
  Shield,
  User,
  Bell,
  AlertTriangle,
  RotateCcw,
  Zap,
  Gauge,
  LogOut,
  ChevronDown,
  PhoneCall,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ onOpenEmergency, onOpenAuth }) {
  const {
    currentUser,
    switchRole,
    buses,
    notifications,
    emergencies,
    simulationSpeed,
    setSimulationSpeed,
    resetDemoData
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeEmergenciesCount = emergencies.filter(e => e.status === 'ACTIVE').length;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-xl">
      {/* Top Banner if Active Emergency */}
      {activeEmergenciesCount > 0 && (
        <div className="bg-[#EA580C]/20 border-b border-[#EA580C]/50 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-[#FFD600] animate-pulse">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
            <span className="font-semibold text-white">ACTIVE CAMPUS ALERT:</span>
            <span className="truncate">{emergencies.find(e => e.status === 'ACTIVE')?.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center shadow-[0_0_20px_-3px_rgba(234,88,12,0.6)]">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD600] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFD600] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-white">
                Uni<span className="bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent">Transit</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-[#94A3B8] border border-white/10">
                GPS LIVE
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] hidden md:block">
              Hostel ↔ College Smart Shuttle Fleet
            </p>
          </div>
        </div>

        {/* Center: Role Switcher Quick Pill (Desktop) */}
        <div className="hidden lg:flex items-center bg-[#030304]/80 p-1 rounded-full border border-white/10 shadow-inner">
          <button
            onClick={() => switchRole('STUDENT')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 ${
              currentUser?.role === 'STUDENT'
                ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_15px_rgba(247,147,26,0.4)]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Student View
          </button>

          <button
            onClick={() => switchRole('DRIVER')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 ${
              currentUser?.role === 'DRIVER'
                ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_15px_rgba(247,147,26,0.4)]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            Driver Console
          </button>

          <button
            onClick={() => switchRole('ADMIN')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 ${
              currentUser?.role === 'ADMIN'
                ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_15px_rgba(247,147,26,0.4)]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Transport Admin
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GPS Simulation Speed Toggle */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0F1115] border border-white/10 rounded-full px-2.5 py-1 text-xs font-mono">
            <Gauge className="w-3.5 h-3.5 text-[#F7931A]" />
            <span className="text-[#94A3B8] text-[10px]">GPS:</span>
            <button
              onClick={() => setSimulationSpeed(simulationSpeed === 1.5 ? 4 : 1.5)}
              className="text-[#FFD600] font-bold hover:underline"
              title="Click to toggle GPS simulation playback speed"
            >
              {simulationSpeed === 1.5 ? '1x Real' : '4x Fast'}
            </button>
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenEmergency}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/60 hover:bg-[#EA580C] hover:text-white transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">EMERGENCY</span> SOS
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="w-9 h-9 rounded-full bg-[#0F1115] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#F7931A]/40 transition-all cursor-pointer relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full bg-[#F7931A] shadow-[0_0_8px_#F7931A]" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0F1115] border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.8)] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#F7931A]" />
                    Live Fleet Dispatch Updates
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    {notifications.length} alerts
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2 mt-3 pr-1">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        n.type === 'danger'
                          ? 'bg-[#EA580C]/10 border-[#EA580C]/40 text-red-200'
                          : n.type === 'warning'
                          ? 'bg-[#FFD600]/10 border-[#FFD600]/40 text-amber-200'
                          : n.type === 'success'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-white/5 border-white/10 text-[#94A3B8]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-white mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-[#94A3B8] font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">{n.message}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-white/10 mt-3 text-center">
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="text-xs text-[#F7931A] hover:underline font-mono"
                  >
                    Close panel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill / Switch */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#0F1115] border border-white/15 hover:border-[#F7931A]/50 transition-all text-xs cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#F7931A]/20 border border-[#F7931A]/40 flex items-center justify-center text-[#F7931A] font-bold text-[10px] font-mono">
                {currentUser?.role === 'STUDENT' ? 'ST' : currentUser?.role === 'DRIVER' ? 'DR' : 'AD'}
              </div>
              <span className="hidden md:inline font-medium text-white max-w-[100px] truncate">
                {currentUser?.name?.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {/* Role dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F1115] border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.8)] p-3 z-50">
                <div className="p-2 border-b border-white/10 mb-2">
                  <p className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">Signed in as</p>
                  <p className="font-heading font-semibold text-sm text-white truncate">{currentUser?.name}</p>
                  <p className="text-xs text-[#F7931A] font-mono">{currentUser?.role} • {currentUser?.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase text-[#94A3B8] px-2 pt-1">Switch Role Portal</p>
                  <button
                    onClick={() => { switchRole('STUDENT'); setShowRoleMenu(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${currentUser?.role === 'STUDENT' ? 'bg-[#F7931A]/20 text-[#F7931A] font-bold' : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'}`}
                  >
                    <span>Student Dashboard</span>
                    {currentUser?.role === 'STUDENT' && <span className="text-[10px] font-mono">ACTIVE</span>}
                  </button>
                  <button
                    onClick={() => { switchRole('DRIVER'); setShowRoleMenu(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${currentUser?.role === 'DRIVER' ? 'bg-[#F7931A]/20 text-[#F7931A] font-bold' : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'}`}
                  >
                    <span>Driver Console</span>
                    {currentUser?.role === 'DRIVER' && <span className="text-[10px] font-mono">ACTIVE</span>}
                  </button>
                  <button
                    onClick={() => { switchRole('ADMIN'); setShowRoleMenu(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between ${currentUser?.role === 'ADMIN' ? 'bg-[#F7931A]/20 text-[#F7931A] font-bold' : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'}`}
                  >
                    <span>Admin Fleet Command</span>
                    {currentUser?.role === 'ADMIN' && <span className="text-[10px] font-mono">ACTIVE</span>}
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 mt-2 flex items-center justify-between">
                  <button
                    onClick={() => { resetDemoData(); setShowRoleMenu(false); }}
                    className="text-[11px] font-mono text-[#94A3B8] hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Demo
                  </button>
                  <button
                    onClick={() => { onOpenAuth(); setShowRoleMenu(false); }}
                    className="text-[11px] font-mono text-[#F7931A] hover:underline"
                  >
                    Custom Login
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full bg-[#0F1115] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0F1115] px-4 py-4 space-y-3">
          <p className="text-xs font-mono uppercase text-[#94A3B8]">Select Dashboard View</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { switchRole('STUDENT'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-xs font-mono font-medium text-center border ${
                currentUser?.role === 'STUDENT'
                  ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white border-transparent'
                  : 'bg-[#030304] text-[#94A3B8] border-white/10'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => { switchRole('DRIVER'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-xs font-mono font-medium text-center border ${
                currentUser?.role === 'DRIVER'
                  ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white border-transparent'
                  : 'bg-[#030304] text-[#94A3B8] border-white/10'
              }`}
            >
              Driver
            </button>
            <button
              onClick={() => { switchRole('ADMIN'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-xs font-mono font-medium text-center border ${
                currentUser?.role === 'ADMIN'
                  ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white border-transparent'
                  : 'bg-[#030304] text-[#94A3B8] border-white/10'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-[#94A3B8] font-mono">GPS Playback:</span>
            <button
              onClick={() => setSimulationSpeed(simulationSpeed === 1.5 ? 4 : 1.5)}
              className="text-[#FFD600] font-mono font-semibold"
            >
              {simulationSpeed === 1.5 ? '1x Normal' : '4x Fast Motion'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
