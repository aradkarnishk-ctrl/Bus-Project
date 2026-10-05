// Pre-seeded college campus coordinates & route waypoints
// Realistic University setting: "Apex University & Technology Campus"
// Center: lat 12.9716, lng 77.5946 (Bangalore Tech Hub) or standardized coordinate grid

export const CAMPUS_LOCATIONS = {
  college: {
    id: 'college_main',
    name: 'Apex Institute of Technology (Main Gate)',
    shortName: 'College Campus',
    type: 'college',
    lat: 12.9719,
    lng: 77.5937,
    description: 'Central Academic Block, Tech Tower & Library'
  },
  hostelA: {
    id: 'hostel_north',
    name: 'North Star Residence (Hostel Block A)',
    shortName: 'Hostel A',
    type: 'hostel',
    lat: 12.9855,
    lng: 77.6080,
    description: 'North Quad, Dining Hall & Sports Arena'
  },
  hostelB: {
    id: 'hostel_emerald',
    name: 'Emerald Woods (Hostel Block B)',
    shortName: 'Hostel B',
    type: 'hostel',
    lat: 12.9590,
    lng: 77.5750,
    description: 'West Wing Dorms & Innovation Hub'
  },
  hostelC: {
    id: 'hostel_heights',
    name: 'Skyline Heights (Hostel Block C)',
    shortName: 'Hostel C',
    type: 'hostel',
    lat: 12.9910,
    lng: 77.5790,
    description: 'Graduate & International Scholars Hostel'
  }
};

// Route 1: Hostel A <-> Main College (Loop with 8 waypoints)
export const ROUTE_1_WAYPOINTS = [
  { lat: 12.9855, lng: 77.6080, name: 'North Star Hostel A Gate', stop: true },
  { lat: 12.9820, lng: 77.6045, name: 'University Sports Complex', stop: true },
  { lat: 12.9785, lng: 77.6010, name: 'Science & Biotech Hub', stop: true },
  { lat: 12.9750, lng: 77.5975, name: 'Crossroad Junction 4', stop: false },
  { lat: 12.9719, lng: 77.5937, name: 'Main Campus Admin & Tech Tower', stop: true },
  { lat: 12.9750, lng: 77.5975, name: 'Crossroad Junction 4', stop: false },
  { lat: 12.9785, lng: 77.6010, name: 'Science & Biotech Hub', stop: true },
  { lat: 12.9820, lng: 77.6045, name: 'University Sports Complex', stop: true },
];

// Route 2: Hostel B <-> Main College
export const ROUTE_2_WAYPOINTS = [
  { lat: 12.9590, lng: 77.5750, name: 'Emerald Woods Hostel B', stop: true },
  { lat: 12.9625, lng: 77.5800, name: 'Metro Interchange Station', stop: true },
  { lat: 12.9660, lng: 77.5850, name: 'South Avenue Tech Park', stop: true },
  { lat: 12.9690, lng: 77.5895, name: 'Campus South Gate', stop: false },
  { lat: 12.9719, lng: 77.5937, name: 'Main Campus Admin & Tech Tower', stop: true },
  { lat: 12.9690, lng: 77.5895, name: 'Campus South Gate', stop: false },
  { lat: 12.9660, lng: 77.5850, name: 'South Avenue Tech Park', stop: true },
  { lat: 12.9625, lng: 77.5800, name: 'Metro Interchange Station', stop: true },
];

// Route 3: Hostel C <-> Main College
export const ROUTE_3_WAYPOINTS = [
  { lat: 12.9910, lng: 77.5790, name: 'Skyline Heights Hostel C', stop: true },
  { lat: 12.9860, lng: 77.5830, name: 'North Boulevard Plaza', stop: true },
  { lat: 12.9810, lng: 77.5875, name: 'Central Library Road', stop: true },
  { lat: 12.9760, lng: 77.5905, name: 'Engineering Quad', stop: false },
  { lat: 12.9719, lng: 77.5937, name: 'Main Campus Admin & Tech Tower', stop: true },
  { lat: 12.9760, lng: 77.5905, name: 'Engineering Quad', stop: false },
  { lat: 12.9810, lng: 77.5875, name: 'Central Library Road', stop: true },
  { lat: 12.9860, lng: 77.5830, name: 'North Boulevard Plaza', stop: true },
];

export const INITIAL_BUSES = [
  {
    id: 'BUS-01',
    number: '01',
    name: 'Falcon Express 01',
    registration: 'KA-01-EB-1082',
    driverId: 'drv-01',
    driverName: 'Rajesh Sharma',
    driverPhone: '+91 98450 12345',
    routeId: 'ROUTE-1',
    routeName: 'Hostel A ↔ Campus Main',
    origin: 'Hostel Block A',
    destination: 'College Main Campus',
    capacity: 32,
    bufferLimit: 5,
    bufferCount: 2,
    bufferStudents: [
      { id: 'buf-1', name: 'Tanvi Rao', rollNo: 'CS23B045', bookedAt: '08:15 AM', status: 'WAITLIST' },
      { id: 'buf-2', name: 'Karthik S.', rollNo: 'EC23B090', bookedAt: '08:18 AM', status: 'WAITLIST' }
    ],
    status: 'RUNNING', // 'RUNNING', 'STOPPED', 'MAINTENANCE'
    speed: 34, // km/h
    currentWaypointIndex: 2,
    fractionBetweenWaypoints: 0.45,
    currentRound: 4,
    direction: 'TOWARDS_COLLEGE', // or 'TOWARDS_HOSTEL'
    etaMinutes: 6,
    nextStop: 'Science & Biotech Hub',
    collegeArrivalTime: '08:45 AM',
    hostelArrivalTime: '09:15 AM',
    bookedSeats: [1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24, 26, 27],
    waypoints: ROUTE_1_WAYPOINTS
  },
  {
    id: 'BUS-02',
    number: '02',
    name: 'Solaris Shuttle 02',
    registration: 'KA-01-EB-4419',
    driverId: 'drv-02',
    driverName: 'Anand Verma',
    driverPhone: '+91 98450 67890',
    routeId: 'ROUTE-2',
    routeName: 'Hostel B ↔ Campus Tech Park',
    origin: 'Hostel Block B',
    destination: 'College Main Campus',
    capacity: 28,
    bufferLimit: 5,
    bufferCount: 1,
    bufferStudents: [
      { id: 'buf-3', name: 'Aditya Nair', rollNo: 'ME22B012', bookedAt: '08:22 AM', status: 'WAITLIST' }
    ],
    status: 'RUNNING',
    speed: 28,
    currentWaypointIndex: 1,
    fractionBetweenWaypoints: 0.8,
    currentRound: 3,
    direction: 'TOWARDS_COLLEGE',
    etaMinutes: 11,
    nextStop: 'Metro Interchange Station',
    collegeArrivalTime: '08:52 AM',
    hostelArrivalTime: '09:25 AM',
    bookedSeats: [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26],
    waypoints: ROUTE_2_WAYPOINTS
  },
  {
    id: 'BUS-03',
    number: '03',
    name: 'Titan Rapid 03',
    registration: 'KA-01-EB-9930',
    driverId: 'drv-03',
    driverName: 'Vikram Patil',
    driverPhone: '+91 98450 99881',
    routeId: 'ROUTE-3',
    routeName: 'Hostel C ↔ Engineering Hub',
    origin: 'Hostel Block C',
    destination: 'College Main Campus',
    capacity: 32,
    bufferLimit: 5,
    bufferCount: 5, // Full buffer!
    bufferStudents: [
      { id: 'buf-4', name: 'Rhea Sen', rollNo: 'CV23B011', bookedAt: '08:05 AM', status: 'WAITLIST' },
      { id: 'buf-5', name: 'Sameer Khan', rollNo: 'CS22B088', bookedAt: '08:08 AM', status: 'WAITLIST' },
      { id: 'buf-6', name: 'Devendra J.', rollNo: 'EE23B044', bookedAt: '08:10 AM', status: 'WAITLIST' },
      { id: 'buf-7', name: 'Ananya Roy', rollNo: 'CS24B002', bookedAt: '08:12 AM', status: 'WAITLIST' },
      { id: 'buf-8', name: 'Pranav Joshi', rollNo: 'AI23B019', bookedAt: '08:14 AM', status: 'WAITLIST' }
    ],
    status: 'RUNNING',
    speed: 22,
    currentWaypointIndex: 3,
    fractionBetweenWaypoints: 0.2,
    currentRound: 5,
    direction: 'TOWARDS_COLLEGE',
    etaMinutes: 3,
    nextStop: 'Engineering Quad',
    collegeArrivalTime: '08:38 AM',
    hostelArrivalTime: '09:05 AM',
    // Full bus: all 32 seats booked!
    bookedSeats: Array.from({ length: 32 }, (_, i) => i + 1),
    waypoints: ROUTE_3_WAYPOINTS
  }
];

export const INITIAL_STUDENT = {
  id: 'stu-101',
  name: 'Arjun Mehta',
  email: 'arjun.cs@campus.edu',
  role: 'STUDENT',
  rollNo: 'CS23B104',
  department: 'Computer Science & AI',
  year: '3rd Year',
  hostel: 'Hostel Block A (North)',
  roomNo: 'A-312',
  phone: '+91 97412 88419'
};

export const INITIAL_DRIVER = {
  id: 'drv-01',
  name: 'Rajesh Sharma',
  email: 'rajesh.driver@campus.edu',
  role: 'DRIVER',
  assignedBusId: 'BUS-01',
  licenseNo: 'DL-042021008892',
  experience: '9 Years',
  rating: 4.9,
  phone: '+91 98450 12345'
};

export const INITIAL_ADMIN = {
  id: 'adm-01',
  name: 'Prof. Suresh Nair',
  email: 'transport.head@campus.edu',
  role: 'ADMIN',
  designation: 'Campus Transport Manager & Dean of Logistics',
  department: 'Campus Administration',
  phone: '+91 98450 99000'
};

export const INITIAL_BOOKINGS = [
  {
    id: 'BK-8902',
    studentId: 'stu-101',
    studentName: 'Arjun Mehta',
    studentRoll: 'CS23B104',
    studentPhone: '+91 97412 88419',
    busId: 'BUS-01',
    busNumber: '01',
    busName: 'Falcon Express 01',
    seatNumber: 15,
    isBuffer: false,
    route: 'Hostel A ↔ Campus Main',
    pickup: 'North Star Hostel A Gate',
    drop: 'Main Campus Admin & Tech Tower',
    tripTime: '08:30 AM',
    bookingDate: 'Today',
    status: 'CONFIRMED',
    qrCodeString: 'UNITRANSIT-PASS-BK8902-SEAT15-BUS01'
  }
];

export const EMERGENCY_CONTACTS = {
  transportManager: {
    name: 'Prof. Suresh Nair (Transport Head)',
    phone: '+91 98450 99000',
    email: 'transport.head@campus.edu'
  },
  campusSecurity: {
    name: 'University Campus Security Control',
    phone: '+91 98450 11223',
    location: 'Gate 1 Main Post'
  },
  medicalCentre: {
    name: 'Apex Health & Medical Center',
    phone: '+91 98450 33445',
    ambulance: '108'
  }
};
