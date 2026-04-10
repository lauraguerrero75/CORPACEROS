import React from "react"

export type NavigationSection = 
  | 'dashboard'
  | 'mapa'
  | 'historial'
  | 'reportes'
  | 'incidentes'
  | 'imagenes'
  | 'settings';

export interface NavigationItem {
  id: NavigationSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export type CorrosionLevel = 'critico' | 'moderado' | 'leve';

export interface Asset {
  id: string;
  name: string;
  zone: string;
  corrosionLevel: CorrosionLevel;
  lastInspection: string;
  trend: 'up' | 'down' | 'stable';
  riskScore: number;
}

export interface Zone {
  id: string;
  name: string;
  city: string;
  totalAssets: number;
  critical: number;
  moderate: number;
  mild: number;
  coordinates: { lat: number; lng: number };
}

export interface Incident {
  id: string;
  assetId: string;
  assetName: string;
  zone: string;
  severity: 'critico' | 'moderado';
  description: string;
  detectedAt: string;
  assignedTo: string;
  status: 'abierto' | 'en-progreso' | 'resuelto';
}

export interface Report {
  id: string;
  title: string;
  type: 'mensual' | 'trimestral' | 'anual';
  date: string;
  fileSize: string;
  zone?: string;
}

export interface InspectionImage {
  id: string;
  assetId: string;
  assetName: string;
  zone: string;
  severity: CorrosionLevel;
  date: string;
  imageUrl: string;
  notes?: string;
}

export interface CorrosionTrend {
  month: string;
  critical: number;
  moderate: number;
  mild: number;
}

export interface ZoneStats {
  zone: string;
  critical: number;
  moderate: number;
  mild: number;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  period?: string;
}

export interface TimeFilter {
  label: string;
  value: '7d' | '30d' | '90d' | 'ytd' | 'all';
}
