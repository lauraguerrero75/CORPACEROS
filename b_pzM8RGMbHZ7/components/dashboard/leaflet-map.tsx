"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface CorrosionPoint {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  level: "leve" | "moderado" | "critico";
  value: number;
  asset: string;
  lastUpdate: string;
}

interface LeafletMapProps {
  points: CorrosionPoint[];
  onPointClick?: (point: CorrosionPoint) => void;
}

const levelColors = {
  leve: "#22C55E",
  moderado: "#F59E0B", 
  critico: "#EF4444",
};

const levelLabels = {
  leve: "Leve",
  moderado: "Moderado",
  critico: "Crítico",
};

export function LeafletMap({ points, onPointClick }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Colombia center coordinates
    const colombiaCenter: L.LatLngExpression = [4.5709, -74.2973];
    
    const map = L.map(mapRef.current, {
      center: colombiaCenter,
      zoom: 6,
      zoomControl: true,
      attributionControl: false,
    });

    // Light style map tiles (OpenStreetMap standard)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    points.forEach((point) => {
      const color = levelColors[point.level];
      
      // Create pulsing circle marker
      const marker = L.circleMarker([point.lat, point.lng], {
        radius: point.level === "critico" ? 12 : point.level === "moderado" ? 10 : 8,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.6,
      }).addTo(map);

      // Popup content
      const popupContent = `
        <div style="
          background: #FFFFFF;
          padding: 12px 16px;
          border-radius: 8px;
          min-width: 200px;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          ">
            <span style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: ${color};
            "></span>
            <span style="
              font-weight: 600;
              color: #111827;
              font-size: 14px;
            ">${point.name}</span>
          </div>
          <div style="color: #6B7280; font-size: 12px; margin-bottom: 4px;">
            ${point.city} - ${point.asset}
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(0,0,0,0.1);
          ">
            <span style="color: #6B7280; font-size: 11px;">Nivel:</span>
            <span style="
              color: ${color};
              font-weight: 600;
              font-size: 13px;
            ">${levelLabels[point.level]} (${point.value}%)</span>
          </div>
          <div style="
            display: flex;
            justify-content: space-between;
            margin-top: 4px;
          ">
            <span style="color: #6B7280; font-size: 11px;">Actualizado:</span>
            <span style="color: #374151; font-size: 11px;">${point.lastUpdate}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: "dark-popup",
        closeButton: false,
      });

      marker.on("click", () => {
        if (onPointClick) onPointClick(point);
      });

      marker.on("mouseover", () => {
        marker.openPopup();
        marker.setStyle({ fillOpacity: 0.9, weight: 3 });
      });

      marker.on("mouseout", () => {
        marker.closePopup();
        marker.setStyle({ fillOpacity: 0.6, weight: 2 });
      });

      markersRef.current.push(marker);
    });
  }, [points, onPointClick]);

  return (
    <>
      <style jsx global>{`
        .light-popup .leaflet-popup-content-wrapper {
          background: transparent;
          box-shadow: none;
          padding: 0;
          border-radius: 8px;
        }
        .light-popup .leaflet-popup-content {
          margin: 0;
        }
        .light-popup .leaflet-popup-tip {
          background: #FFFFFF;
        }
        .leaflet-control-zoom a {
          background: #FFFFFF !important;
          color: #374151 !important;
          border-color: #E5E7EB !important;
        }
        .leaflet-control-zoom a:hover {
          background: #F3F4F6 !important;
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full rounded-xl" />
    </>
  );
}
