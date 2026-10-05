import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Bus, Shield, X, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { INITIAL_STUDENT, INITIAL_DRIVER, INITIAL_ADMIN } from '../data/mockData';

export default function AuthModal({ isOpen, onClose }) {
  const { setCurrentUser, addToast } = useApp();
  const [roleTab, setRoleTab] = useState('STUDENT'); // 'STUDENT', 'DRIVER', 'ADMIN'
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollOrId, setRollOrId] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    let userObj;
    if (roleTab === 'STUDENT') {
      userObj = {
        id: 'stu-' + Date.now(),
        name: name || 'Demo Student',
        email: email || 'student@campus.edu',
        role: 'STUDENT',
        rollNo: rollOrId || 'CS23B104',
        department: 'Engineering & CS',
        year: '3rd Year',
        hostel: 'Hostel Block A',
        roomNo: 'A-204',
        phone: '+91 97412 88419'
      };
    } else if (roleTab === 'DRIVER') {
      userObj = {
        id: 'drv-' + Date.now(),
        name: name || 'Demo Driver',
        email: email || 'driver@campus.edu',
        role: 'DRIVER',
        assignedBusId: 'BUS-01',
        licenseNo: rollOrId || 'DL-KA-88992',
        experience: '8 Years',
        phone: '+91 98450 12345'
      };
    } else {
      userObj = {
        id: 'adm-' + Date.now(),
        name: name || 'Transport Admin',
        email: email || 'admin@campus.edu',
        role: 'ADMIN',
        designation: 'Campus Logistics Officer',
        department: 'Operations',
        phone: '+91 98450 99000'
      };
    }

    setCurrentUser(userObj);
    addToast('Authentication Success', `Signed in as ${userObj.name} (${userObj.role})`, 'success');
    onClose();
  };

  const quickDemoLogin = (role) => {
    if (role === 'STUDENT') setCurrentUser(INITIAL_STUDENT);
    if (role === 'DRIVER') setCurrentUser(INITIAL_DRIVER);
    if (role === 'ADMIN') setCurrentUser(INITIAL_ADMIN);

    addToast('Demo Login', `Switched into ${role} role account`, 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-[#0F1115] border border-white/15 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(247,147,26,0.2)] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#F7931A] mx-auto flex items-center justify-center text-white shadow-[0_0_20px_#F7931A]">
            <Bus className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-2xl text-white pt-2">
            Uni<span className="bg-gradient-to-r from-[#F7931A] to-[#FFD600] bg-clip-text text-transparent">Transit</span> Portal
          </h2>
          <p className="text-xs text-[#94A3B8] font-mono">
            {isSignup ? 'Create your institutional transit account' : 'Sign in to access college bus network'}
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="grid grid-cols-3 gap-2 bg-[#030304] p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'STUDENT', label: 'Student', icon: User },
            { id: 'DRIVER', label: 'Driver', icon: Bus },
            { id: 'ADMIN', label: 'Admin', icon: Shield }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = roleTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setRoleTab(tab.id)}
                className={`py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white font-bold shadow-[0_0_12px_rgba(247,147,26,0.5)]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1-Click Fast Demo Buttons */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <p className="text-[10px] font-mono uppercase text-[#F7931A] flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3 text-[#FFD600]" /> Instant 1-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => quickDemoLogin('STUDENT')}
              className="p-1.5 rounded-lg bg-[#030304] border border-white/10 hover:border-[#F7931A] text-[#94A3B8] hover:text-white text-center truncate"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin('DRIVER')}
              className="p-1.5 rounded-lg bg-[#030304] border border-white/10 hover:border-[#F7931A] text-[#94A3B8] hover:text-white text-center truncate"
            >
              Demo Driver
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin('ADMIN')}
              className="p-1.5 rounded-lg bg-[#030304] border border-white/10 hover:border-[#F7931A] text-[#94A3B8] hover:text-white text-center truncate"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Custom Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignup && (
            <div>
              <label className="text-xs font-mono text-[#94A3B8] block mb-1">Full Legal Name:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arjun Mehta"
                className="w-full bg-[#030304] border border-white/15 focus:border-[#F7931A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Campus Email Address:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={roleTab === 'STUDENT' ? 'arjun@campus.edu' : roleTab === 'DRIVER' ? 'driver@campus.edu' : 'admin@campus.edu'}
              className="w-full bg-[#030304] border border-white/15 focus:border-[#F7931A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">
              {roleTab === 'STUDENT' ? 'University Roll Number:' : roleTab === 'DRIVER' ? 'Driving License No:' : 'Employee Admin ID:'}
            </label>
            <input
              type="text"
              required
              value={rollOrId}
              onChange={(e) => setRollOrId(e.target.value)}
              placeholder={roleTab === 'STUDENT' ? 'CS23B104' : roleTab === 'DRIVER' ? 'DL-042021008892' : 'ADM-LOGISTICS-01'}
              className="w-full bg-[#030304] border border-white/15 focus:border-[#F7931A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#94A3B8] block mb-1">Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#030304] border border-white/15 focus:border-[#F7931A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white shadow-[0_0_20px_rgba(247,147,26,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isSignup ? `Register as ${roleTab}` : `Sign In as ${roleTab}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs font-mono text-[#94A3B8] hover:text-[#F7931A] transition-colors"
          >
            {isSignup ? 'Already registered? Sign in here' : "Don't have an institutional account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
