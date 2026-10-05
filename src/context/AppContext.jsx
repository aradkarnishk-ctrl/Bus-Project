import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  INITIAL_BUSES,
  INITIAL_STUDENT,
  INITIAL_DRIVER,
  INITIAL_ADMIN,
  INITIAL_BOOKINGS,
  CAMPUS_LOCATIONS
} from '../data/mockData';

const AppContext = createContext();

const STORAGE_KEY_BUSES = 'unitransit_buses_v1';
const STORAGE_KEY_BOOKINGS = 'unitransit_bookings_v1';
const STORAGE_KEY_USER = 'unitransit_user_v1';
const STORAGE_KEY_EMERGENCIES = 'unitransit_emergencies_v1';

export function AppProvider({ children }) {
  // 1. Current logged-in user (defaults to Student for immediate exploration)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_STUDENT;
  });

  // 2. Buses state
  const [buses, setBuses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BUSES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_BUSES;
  });

  // 3. Bookings state
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_BOOKINGS;
  });

  // 4. Emergency alerts
  const [emergencies, setEmergencies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EMERGENCIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'EMG-101',
        type: 'HEAVY_TRAFFIC_DELAY',
        senderRole: 'DRIVER',
        senderName: 'Vikram Patil (Bus 03)',
        busId: 'BUS-03',
        location: 'Engineering Quad Crossroad',
        message: 'Sudden road work delay on Main Gate turn. Estimated 5 min slow crawl.',
        timestamp: '10 mins ago',
        status: 'ACTIVE',
        severity: 'MEDIUM'
      }
    ];
  });

  // 5. In-app Toasts / Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Morning Campus Fleet Active',
      message: 'All 3 campus buses running scheduled loops between Hostels & Main Campus.',
      time: 'Just now',
      type: 'info'
    }
  ]);

  // Demo GPS simulation speed multiplier (1x = standard, 3x = fast demo)
  const [simulationSpeed, setSimulationSpeed] = useState(1.5);
  const [selectedBusId, setSelectedBusId] = useState('BUS-01');

  // Audio chime simulation (visual toast + audio alert toggle)
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BUSES, JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMERGENCIES, JSON.stringify(emergencies));
  }, [emergencies]);

  // Add toast helper
  const addToast = (title, message, type = 'info') => {
    const newNotif = {
      id: 'notif-' + Date.now() + Math.random().toString(36).substring(2, 6),
      title,
      message,
      time: 'Just now',
      type
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
  };

  // GPS Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => {
        return prevBuses.map(bus => {
          if (bus.status !== 'RUNNING') return bus;

          const waypoints = bus.waypoints;
          if (!waypoints || waypoints.length === 0) return bus;

          const currentIndex = bus.currentWaypointIndex || 0;
          const nextIndex = (currentIndex + 1) % waypoints.length;
          const currentPt = waypoints[currentIndex];
          const nextPt = waypoints[nextIndex];

          // Advance fraction based on simulationSpeed
          const step = 0.05 * simulationSpeed;
          let newFraction = (bus.fractionBetweenWaypoints || 0) + step;
          let newIndex = currentIndex;
          let newRound = bus.currentRound || 1;

          if (newFraction >= 1.0) {
            newFraction = 0;
            newIndex = nextIndex;
            // Completed a loop
            if (newIndex === 0) {
              newRound += 1;
            }
          }

          // Compute interpolated lat & lng
          const lat = currentPt.lat + (nextPt.lat - currentPt.lat) * newFraction;
          const lng = currentPt.lng + (nextPt.lng - currentPt.lng) * newFraction;

          // Estimate ETA to destination stop
          const remainingWaypoints = (waypoints.length - newIndex) % waypoints.length;
          const calculatedETA = Math.max(1, Math.round((remainingWaypoints + (1 - newFraction)) * 2));

          const nextStopName = nextPt.stop ? nextPt.name : (waypoints[(newIndex + 2) % waypoints.length]?.name || 'Central Campus Gate');

          return {
            ...bus,
            currentWaypointIndex: newIndex,
            fractionBetweenWaypoints: newFraction,
            currentRound: newRound,
            currentLocation: { lat, lng },
            etaMinutes: calculatedETA,
            nextStop: nextStopName,
            direction: newIndex < waypoints.length / 2 ? 'TOWARDS_COLLEGE' : 'TOWARDS_HOSTEL'
          };
        });
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [simulationSpeed]);

  // Compute live location for each bus (with fallback)
  const getBusLiveCoords = (bus) => {
    if (bus.currentLocation && bus.currentLocation.lat && bus.currentLocation.lng) {
      return [bus.currentLocation.lat, bus.currentLocation.lng];
    }
    const waypoints = bus.waypoints;
    if (waypoints && waypoints.length > 0) {
      const idx = bus.currentWaypointIndex || 0;
      const cur = waypoints[idx];
      const nxt = waypoints[(idx + 1) % waypoints.length];
      const frac = bus.fractionBetweenWaypoints || 0;
      return [
        cur.lat + (nxt.lat - cur.lat) * frac,
        cur.lng + (nxt.lng - cur.lng) * frac
      ];
    }
    return [12.9719, 77.5937];
  };

  // Actions
  const switchRole = (role) => {
    if (role === 'STUDENT') {
      setCurrentUser(INITIAL_STUDENT);
      addToast('Role Switched', 'Logged in as Student: Arjun Mehta (Roll CS23B104)', 'info');
    } else if (role === 'DRIVER') {
      setCurrentUser(INITIAL_DRIVER);
      setSelectedBusId('BUS-01');
      addToast('Role Switched', 'Logged in as Driver: Rajesh Sharma (Bus #01)', 'info');
    } else if (role === 'ADMIN') {
      setCurrentUser(INITIAL_ADMIN);
      addToast('Role Switched', 'Logged in as Admin: Transport Management Control', 'info');
    }
  };

  const bookSeat = (busId, seatNumber, pickup = 'Hostel Gate', drop = 'Main Campus') => {
    const bus = buses.find(b => b.id === busId);
    if (!bus) return { success: false, message: 'Bus not found' };

    if (bus.bookedSeats.includes(seatNumber)) {
      return { success: false, message: 'Seat already reserved by another student' };
    }

    // Update bus bookedSeats
    const updatedBookedSeats = [...bus.bookedSeats, seatNumber];
    const isFull = updatedBookedSeats.length >= bus.capacity;

    setBuses(prev => prev.map(b => {
      if (b.id === busId) {
        return {
          ...b,
          bookedSeats: updatedBookedSeats
        };
      }
      return b;
    }));

    // Create booking
    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: bookingId,
      studentId: currentUser?.id || 'stu-guest',
      studentName: currentUser?.name || 'Student Guest',
      studentRoll: currentUser?.rollNo || 'CS23B104',
      studentPhone: currentUser?.phone || '+91 97412 88419',
      busId: bus.id,
      busNumber: bus.number,
      busName: bus.name,
      seatNumber: seatNumber,
      isBuffer: false,
      route: bus.routeName,
      pickup: pickup,
      drop: drop,
      tripTime: '08:30 AM',
      bookingDate: 'Today',
      status: 'CONFIRMED',
      qrCodeString: `UNITRANSIT-PASS-${bookingId}-SEAT${seatNumber}-${bus.id}`
    };

    setBookings(prev => [newBooking, ...prev]);
    addToast('Seat Reserved!', `Seat #${seatNumber} successfully confirmed on ${bus.name}`, 'success');

    if (isFull) {
      addToast('Bus Full Alert', `${bus.name} has reached maximum seat capacity (${bus.capacity}/${bus.capacity})! Buffer standby queue active.`, 'warning');
    }

    return { success: true, booking: newBooking };
  };

  const cancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Free the seat
    setBuses(prev => prev.map(bus => {
      if (bus.id === booking.busId) {
        return {
          ...bus,
          bookedSeats: bus.bookedSeats.filter(s => s !== booking.seatNumber)
        };
      }
      return bus;
    }));

    setBookings(prev => prev.filter(b => b.id !== bookingId));
    addToast('Booking Cancelled', `Seat #${booking.seatNumber} on ${booking.busName} has been cancelled and reopened.`, 'info');
  };

  // Buffer Students feature (Driver can allow up to 5 buffer students)
  const addBufferStudent = (busId, studentData = null) => {
    const bus = buses.find(b => b.id === busId);
    if (!bus) return { success: false, message: 'Bus not found' };

    if ((bus.bufferCount || 0) >= (bus.bufferLimit || 5)) {
      addToast('Buffer Limit Reached', `Maximum 5 buffer standby students already registered on ${bus.name}`, 'warning');
      return { success: false, message: 'Buffer limit reached (max 5 students)' };
    }

    const newStudent = studentData || {
      id: 'buf-' + Date.now(),
      name: currentUser?.name || 'Walk-in Student',
      rollNo: currentUser?.rollNo || 'CS23B' + Math.floor(100 + Math.random() * 899),
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'BOARDED'
    };

    setBuses(prev => prev.map(b => {
      if (b.id === busId) {
        const nextCount = (b.bufferCount || 0) + 1;
        const nextList = [...(b.bufferStudents || []), newStudent];
        return {
          ...b,
          bufferCount: nextCount,
          bufferStudents: nextList
        };
      }
      return b;
    }));

    addToast('Buffer Student Added', `${newStudent.name} granted buffer standby boarding on ${bus.name}.`, 'success');
    return { success: true };
  };

  const removeBufferStudent = (busId, bufferStudentId) => {
    setBuses(prev => prev.map(b => {
      if (b.id === busId) {
        return {
          ...b,
          bufferCount: Math.max(0, (b.bufferCount || 1) - 1),
          bufferStudents: (b.bufferStudents || []).filter(s => s.id !== bufferStudentId)
        };
      }
      return b;
    }));
    addToast('Buffer Removed', 'Buffer student removed from standby list.', 'info');
  };

  // Toggle Bus Start / Stop (Driver feature)
  const toggleBusStatus = (busId) => {
    setBuses(prev => prev.map(bus => {
      if (bus.id === busId) {
        const nextStatus = bus.status === 'RUNNING' ? 'STOPPED' : 'RUNNING';
        addToast(
          nextStatus === 'RUNNING' ? 'Bus Trip Resumed' : 'Bus Halted',
          `${bus.name} is now ${nextStatus === 'RUNNING' ? 'LIVE on route (GPS active)' : 'PAUSED at current stop'}`,
          nextStatus === 'RUNNING' ? 'success' : 'warning'
        );
        return {
          ...bus,
          status: nextStatus,
          speed: nextStatus === 'RUNNING' ? 28 : 0
        };
      }
      return bus;
    }));
  };

  // Emergency SOS trigger
  const raiseEmergency = (alertData) => {
    const newEmergency = {
      id: 'EMG-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: 'Just now',
      status: 'ACTIVE',
      severity: alertData.severity || 'HIGH',
      ...alertData
    };

    setEmergencies(prev => [newEmergency, ...prev]);
    addToast(
      '🚨 EMERGENCY SOS BROADCAST',
      `${alertData.senderName}: ${alertData.message}`,
      'danger'
    );
  };

  const resolveEmergency = (emergencyId) => {
    setEmergencies(prev => prev.map(emg => {
      if (emg.id === emergencyId) {
        return { ...emg, status: 'RESOLVED' };
      }
      return emg;
    }));
    addToast('Emergency Resolved', `Alert #${emergencyId} marked as safely resolved by Transport Admin.`, 'info');
  };

  // Admin controls
  const addBus = (busData) => {
    const newBus = {
      id: 'BUS-0' + (buses.length + 1),
      number: '0' + (buses.length + 1),
      name: busData.name || `Campus Shuttle 0${buses.length + 1}`,
      registration: busData.registration || `KA-01-EB-${Math.floor(1000 + Math.random() * 9000)}`,
      driverId: 'drv-new',
      driverName: busData.driverName || 'Designated Driver',
      driverPhone: busData.driverPhone || '+91 98450 00000',
      routeId: 'ROUTE-1',
      routeName: busData.routeName || 'Hostel A ↔ Campus Main',
      origin: 'Hostel A',
      destination: 'Campus Main',
      capacity: parseInt(busData.capacity) || 32,
      bufferLimit: 5,
      bufferCount: 0,
      bufferStudents: [],
      status: 'RUNNING',
      speed: 30,
      currentWaypointIndex: 0,
      fractionBetweenWaypoints: 0,
      currentRound: 1,
      direction: 'TOWARDS_COLLEGE',
      etaMinutes: 12,
      nextStop: 'Campus Gate',
      collegeArrivalTime: '09:00 AM',
      hostelArrivalTime: '09:30 AM',
      bookedSeats: [],
      waypoints: busData.waypoints || INITIAL_BUSES[0].waypoints
    };

    setBuses(prev => [...prev, newBus]);
    addToast('New Bus Added', `${newBus.name} successfully deployed to the fleet roster.`, 'success');
  };

  const updateBus = (busId, updates) => {
    setBuses(prev => prev.map(bus => bus.id === busId ? { ...bus, ...updates } : bus));
    addToast('Fleet Updated', `Bus configuration updated.`, 'info');
  };

  const deleteBus = (busId) => {
    if (buses.length <= 1) {
      addToast('Cannot Delete', 'Fleet requires at least one active bus.', 'warning');
      return;
    }
    setBuses(prev => prev.filter(b => b.id !== busId));
    addToast('Bus Retired', `Bus #${busId} removed from active fleet.`, 'info');
  };

  // Reset to demo defaults
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_BUSES);
    localStorage.removeItem(STORAGE_KEY_BOOKINGS);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_EMERGENCIES);
    setBuses(INITIAL_BUSES);
    setBookings(INITIAL_BOOKINGS);
    setCurrentUser(INITIAL_STUDENT);
    setEmergencies([]);
    addToast('Data Reset', 'Restored pristine demo college transit state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        buses,
        selectedBusId,
        setSelectedBusId,
        bookings,
        bookSeat,
        cancelBooking,
        addBufferStudent,
        removeBufferStudent,
        toggleBusStatus,
        emergencies,
        raiseEmergency,
        resolveEmergency,
        addBus,
        updateBus,
        deleteBus,
        notifications,
        addToast,
        simulationSpeed,
        setSimulationSpeed,
        getBusLiveCoords,
        resetDemoData,
        soundEnabled,
        setSoundEnabled,
        locations: CAMPUS_LOCATIONS
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
