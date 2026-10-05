import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bus, MapPin, Navigation, Maximize2, Zap, Compass, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import L from 'leaflet';

export default function LiveMap({
  highlightBusId = null,
  height = '420px',
  onSelectBus = null,
  showControls = true
}) {
  const { buses, selectedBusId, setSelectedBusId, locations, getBusLiveCoords } = useApp();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylineGroupRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [viewMode, setViewMode] = useState('ALL'); // 'ALL' or specific busId

  const activeFocusBusId = highlightBusId || (viewMode !== 'ALL' ? viewMode : selectedBusId);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map already initialized
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [12.9750, 77.5940],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter tiles (free, fast, no API key needed, matches Bitcoin DeFi void aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap, &copy; CARTO'
      }).addTo(map);

      polylineGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setMapReady(true);

      // Render Static Campus & Hostel Markers
      const createLandmarkIcon = (label, color, type) => {
        return L.divIcon({
          className: 'custom-landmark-icon',
          html: `
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              background: rgba(15, 17, 21, 0.9);
              border: 1px solid ${color};
              padding: 4px 8px;
              border-radius: 9999px;
              box-shadow: 0 0 15px ${color}66;
              white-space: nowrap;
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              font-weight: 600;
              color: #ffffff;
            ">
              <span style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${color};
                box-shadow: 0 0 8px ${color};
                display: inline-block;
              "></span>
              <span>${label}</span>
            </div>
          `,
          iconSize: [120, 28],
          iconAnchor: [60, 14]
        });
      };

      // Add College Main Campus
      L.marker([locations.college.lat, locations.college.lng], {
        icon: createLandmarkIcon('🎓 College Main Gate', '#FFD600', 'college')
      }).addTo(map).bindPopup(`
        <div style="font-family:'Space Grotesk',sans-serif; color:white; padding:4px;">
          <h4 style="font-weight:700; color:#FFD600; margin:0 0 4px 0;">${locations.college.name}</h4>
          <p style="font-size:12px; color:#94A3B8; margin:0;">${locations.college.description}</p>
        </div>
      `);

      // Add Hostels
      L.marker([locations.hostelA.lat, locations.hostelA.lng], {
        icon: createLandmarkIcon('🏠 Hostel Block A', '#F7931A', 'hostel')
      }).addTo(map);

      L.marker([locations.hostelB.lat, locations.hostelB.lng], {
        icon: createLandmarkIcon('🏠 Hostel Block B', '#F7931A', 'hostel')
      }).addTo(map);

      L.marker([locations.hostelC.lat, locations.hostelC.lng], {
        icon: createLandmarkIcon('🏠 Hostel Block C', '#F7931A', 'hostel')
      }).addTo(map);

    } catch (e) {
      console.error('Error initializing map:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Route Polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !polylineGroupRef.current) return;

    polylineGroupRef.current.clearLayers();

    const colors = {
      'BUS-01': '#F7931A', // Bitcoin Orange
      'BUS-02': '#FFD600', // Digital Gold
      'BUS-03': '#EA580C'  // Burnt Orange
    };

    buses.forEach(bus => {
      if (viewMode !== 'ALL' && bus.id !== viewMode) return;

      if (bus.waypoints && bus.waypoints.length > 0) {
        const latlngs = bus.waypoints.map(w => [w.lat, w.lng]);
        // Close loop
        latlngs.push([bus.waypoints[0].lat, bus.waypoints[0].lng]);

        const polyline = L.polyline(latlngs, {
          color: colors[bus.id] || '#F7931A',
          weight: activeFocusBusId === bus.id ? 4 : 2.5,
          opacity: activeFocusBusId === bus.id ? 0.9 : 0.45,
          dashArray: bus.status === 'RUNNING' ? '6, 8' : undefined
        });

        polylineGroupRef.current.addLayer(polyline);
      }
    });
  }, [buses, viewMode, activeFocusBusId]);

  // Update Bus Live Markers on each GPS tick
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    buses.forEach(bus => {
      const coords = getBusLiveCoords(bus);
      const isSelected = activeFocusBusId === bus.id;
      const seatsLeft = bus.capacity - bus.bookedSeats.length;
      const isFull = seatsLeft <= 0;

      const markerHtml = `
        <div style="
          position: relative;
          cursor: pointer;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- Outer Pulsing Glow -->
          ${bus.status === 'RUNNING' ? `
            <div style="
              position: absolute;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: ${isSelected ? '#FFD600' : '#F7931A'};
              opacity: 0.35;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}

          <!-- Bus Node Badge -->
          <div style="
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 5px;
            background: #0F1115;
            border: 2px solid ${isSelected ? '#FFD600' : isFull ? '#EA580C' : '#F7931A'};
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 9999px;
            box-shadow: 0 0 20px ${isSelected ? 'rgba(255,214,0,0.6)' : 'rgba(247,147,26,0.45)'};
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
          ">
            <span style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${bus.status === 'RUNNING' ? '#10B981' : '#EF4444'};
              box-shadow: 0 0 8px ${bus.status === 'RUNNING' ? '#10B981' : '#EF4444'};
            "></span>
            <span>BUS ${bus.number}</span>
            <span style="
              background: ${isFull ? '#EA580C' : 'rgba(255,255,255,0.1)'};
              padding: 1px 5px;
              border-radius: 4px;
              font-size: 10px;
              color: ${isFull ? '#ffffff' : '#FFD600'};
            ">${isFull ? 'FULL' : `${seatsLeft} seats`}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'bus-gps-marker',
        html: markerHtml,
        iconSize: [110, 40],
        iconAnchor: [55, 20]
      });

      if (!markersRef.current[bus.id]) {
        // Create new marker
        const marker = L.marker(coords, { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedBusId(bus.id);
          if (onSelectBus) onSelectBus(bus.id);
        });

        markersRef.current[bus.id] = marker;
      } else {
        // Smoothly update existing marker position & icon
        const marker = markersRef.current[bus.id];
        marker.setLatLng(coords);
        marker.setIcon(customIcon);
      }
    });

    // Auto-center if focusing on single bus
    if (activeFocusBusId && markersRef.current[activeFocusBusId] && viewMode !== 'ALL') {
      const targetCoords = markersRef.current[activeFocusBusId].getLatLng();
      map.panTo(targetCoords, { animate: true, duration: 0.8 });
    }
  }, [buses, activeFocusBusId, viewMode]);

  const recenterAll = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([12.9750, 77.5940], 13);
      setViewMode('ALL');
    }
  };

  const focusBus = (busId) => {
    setSelectedBusId(busId);
    setViewMode(busId);
    const bus = buses.find(b => b.id === busId);
    if (bus && mapInstanceRef.current) {
      const coords = getBusLiveCoords(bus);
      mapInstanceRef.current.setView(coords, 15, { animate: true });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 glass-panel shadow-[0_0_40px_rgba(0,0,0,0.7)]">
      {/* Map Control Header Bar */}
      {showControls && (
        <div className="p-3 sm:p-4 bg-[#0F1115]/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-heading font-semibold text-xs sm:text-sm text-white flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#F7931A]" />
              Live Campus Transit Radar
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#94A3B8] border border-white/10">
              Mock GPS Active
            </span>
          </div>

          {/* Quick Bus Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            <button
              onClick={recenterAll}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                viewMode === 'ALL'
                  ? 'bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white font-bold shadow-[0_0_12px_rgba(247,147,26,0.5)]'
                  : 'bg-[#030304] text-[#94A3B8] hover:text-white border border-white/10'
              }`}
            >
              All Fleet
            </button>

            {buses.map(b => (
              <button
                key={b.id}
                onClick={() => focusBus(b.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1 ${
                  activeFocusBusId === b.id && viewMode !== 'ALL'
                    ? 'bg-[#FFD600] text-black font-bold shadow-[0_0_12px_rgba(255,214,0,0.6)]'
                    : 'bg-[#030304] text-[#94A3B8] hover:text-white border border-white/10'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A]" />
                Bus {b.number}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Leaflet Map Target */}
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className="relative z-0 bg-[#030304]"
      />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-[#0F1115]/90 border border-white/15 px-3 py-1.5 rounded-xl backdrop-blur-md text-[11px] font-mono text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD600] shadow-[0_0_6px_#FFD600]" />
          <span className="text-white">College Main</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F7931A] shadow-[0_0_6px_#F7931A]" />
          <span className="text-white">Hostels A, B, C</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>Moving Loop</span>
        </div>
      </div>
    </div>
  );
}
