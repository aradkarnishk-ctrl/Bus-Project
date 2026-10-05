import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import StudentDashboard from './components/StudentDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import EmergencyModal from './components/EmergencyModal';
import AuthModal from './components/AuthModal';
import {
  Bus,
  Shield,
  User,
  Zap,
  Radio,
  Clock,
  Compass,
  HeartHandshake
} from 'lucide-react';

function MainApp() {
  const { currentUser, switchRole, buses } = useApp();
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030304] text-white flex flex-col relative selection:bg-[#F7931A] selection:text-black">
      {/* Background ambient pattern & glowing radials */}
      <div className="fixed inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#EA580C] opacity-10 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-0 w-[450px] h-[350px] bg-[#F7931A] opacity-8 blur-[160px] pointer-events-none rounded-full" />

      {/* Main Navbar */}
      <Navbar
        onOpenEmergency={() => setEmergencyOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* Main Body Content based on active user role */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {currentUser?.role === 'STUDENT' && (
          <StudentDashboard onOpenEmergency={() => setEmergencyOpen(true)} />
        )}

        {currentUser?.role === 'DRIVER' && (
          <DriverDashboard onOpenEmergency={() => setEmergencyOpen(true)} />
        )}

        {currentUser?.role === 'ADMIN' && (
          <AdminDashboard onOpenEmergency={() => setEmergencyOpen(true)} />
        )}
      </main>

      {/* Modals */}
      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      {/* Floating Bottom Quick Role Switcher for Mobile & Easy Testing */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#0F1115]/95 border border-white/15 px-3 py-1.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center gap-1 sm:hidden">
        <button
          onClick={() => switchRole('STUDENT')}
          className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
            currentUser?.role === 'STUDENT' ? 'bg-[#F7931A] text-black font-bold' : 'text-[#94A3B8]'
          }`}
        >
          Student
        </button>
        <button
          onClick={() => switchRole('DRIVER')}
          className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
            currentUser?.role === 'DRIVER' ? 'bg-[#F7931A] text-black font-bold' : 'text-[#94A3B8]'
          }`}
        >
          Driver
        </button>
        <button
          onClick={() => switchRole('ADMIN')}
          className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all ${
            currentUser?.role === 'ADMIN' ? 'bg-[#F7931A] text-black font-bold' : 'text-[#94A3B8]'
          }`}
        >
          Admin
        </button>
      </div>

      {/* Minimal Clean Technical Footer */}
      <footer className="border-t border-white/10 bg-[#030304]/90 py-6 relative z-10 text-xs font-mono text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white font-semibold">UniTransit Fleet Telemetry Online</span>
            <span className="text-[10px] text-[#94A3B8]">• Mock GPS Live Feed</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Apex University Institute of Technology</span>
            <span className="text-[#F7931A]">Hostel ↔ College Corridor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
