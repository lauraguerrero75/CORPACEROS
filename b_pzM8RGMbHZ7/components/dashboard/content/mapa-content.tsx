"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, Activity, RefreshCw, Wifi } from "lucide-react";
import type { CorrosionPoint } from "../leaflet-map";

// Dynamic import to avoid SSR issues with Leaflet
const LeafletMap = dynamic(
  () => import("../leaflet-map").then((mod) => mod.LeafletMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Cargando mapa...</span>
        </div>
      </div>
    ),
  }
);

// Initial corrosion points data
const initialCorrosionPoints: CorrosionPoint[] = [
  // Barranquilla
  { id: "BAQ-001", name: "Tanque Norte A1", city: "Barranquilla", lat: 10.9878, lng: -74.7889, level: "critico", value: 78, asset: "Tanque de almacenamiento", lastUpdate: "" },
  { id: "BAQ-002", name: "Tubería Principal B3", city: "Barranquilla", lat: 10.9632, lng: -74.8010, level: "moderado", value: 45, asset: "Tubería industrial", lastUpdate: "" },
  { id: "BAQ-003", name: "Estructura Puerto C2", city: "Barranquilla", lat: 10.9445, lng: -74.7654, level: "leve", value: 18, asset: "Estructura metálica", lastUpdate: "" },
  // Cartagena
  { id: "CTG-001", name: "Plataforma Marina D1", city: "Cartagena", lat: 10.4236, lng: -75.5280, level: "critico", value: 82, asset: "Plataforma offshore", lastUpdate: "" },
  { id: "CTG-002", name: "Ducto Refinería E4", city: "Cartagena", lat: 10.3910, lng: -75.4794, level: "moderado", value: 52, asset: "Ducto de transporte", lastUpdate: "" },
  { id: "CTG-003", name: "Torre de Enfriamiento F2", city: "Cartagena", lat: 10.3567, lng: -75.5123, level: "leve", value: 22, asset: "Sistema de enfriamiento", lastUpdate: "" },
  // Bogotá
  { id: "BOG-001", name: "Tanque Reserva G1", city: "Bogotá", lat: 4.7110, lng: -74.0721, level: "moderado", value: 38, asset: "Tanque de reserva", lastUpdate: "" },
  { id: "BOG-002", name: "Estructura Central H3", city: "Bogotá", lat: 4.6486, lng: -74.1077, level: "leve", value: 15, asset: "Estructura industrial", lastUpdate: "" },
  { id: "BOG-003", name: "Red de Distribución I2", city: "Bogotá", lat: 4.6821, lng: -74.0489, level: "leve", value: 12, asset: "Red de tuberías", lastUpdate: "" },
  // Medellín
  { id: "MDE-001", name: "Planta Industrial J1", city: "Medellín", lat: 6.2518, lng: -75.5636, level: "critico", value: 71, asset: "Planta procesadora", lastUpdate: "" },
  { id: "MDE-002", name: "Silo Almacenamiento K4", city: "Medellín", lat: 6.2087, lng: -75.5900, level: "moderado", value: 48, asset: "Silo metálico", lastUpdate: "" },
  { id: "MDE-003", name: "Puente Grúa L2", city: "Medellín", lat: 6.2342, lng: -75.5412, level: "leve", value: 25, asset: "Equipo de izaje", lastUpdate: "" },
  // Cali
  { id: "CLO-001", name: "Reactor Químico M1", city: "Cali", lat: 3.4516, lng: -76.5320, level: "moderado", value: 55, asset: "Reactor industrial", lastUpdate: "" },
  { id: "CLO-002", name: "Caldera Principal N3", city: "Cali", lat: 3.4045, lng: -76.4963, level: "critico", value: 68, asset: "Sistema de calderas", lastUpdate: "" },
  { id: "CLO-003", name: "Intercambiador O2", city: "Cali", lat: 3.4278, lng: -76.5521, level: "leve", value: 19, asset: "Intercambiador de calor", lastUpdate: "" },
  // Buenaventura
  { id: "BUN-001", name: "Muelle Principal P1", city: "Buenaventura", lat: 3.8801, lng: -77.0311, level: "critico", value: 85, asset: "Estructura portuaria", lastUpdate: "" },
  { id: "BUN-002", name: "Grúa Portuaria Q4", city: "Buenaventura", lat: 3.8654, lng: -77.0189, level: "moderado", value: 42, asset: "Grúa de carga", lastUpdate: "" },
  { id: "BUN-003", name: "Almacén Costero R2", city: "Buenaventura", lat: 3.8912, lng: -77.0456, level: "moderado", value: 39, asset: "Bodega industrial", lastUpdate: "" },
];

// Function to generate random variation
const generateVariation = (baseValue: number, range: number): number => {
  const variation = (Math.random() - 0.5) * 2 * range;
  const newValue = Math.round(baseValue + variation);
  return Math.max(0, Math.min(100, newValue));
};

// Function to determine level based on value
const determineLevel = (value: number): "leve" | "moderado" | "critico" => {
  if (value >= 60) return "critico";
  if (value >= 30) return "moderado";
  return "leve";
};

// Format current time
const formatTime = (): string => {
  return new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export function MapaContent() {
  const [points, setPoints] = useState<CorrosionPoint[]>([]);
  const [lastGlobalUpdate, setLastGlobalUpdate] = useState<string>("");
  const [isLive, setIsLive] = useState(true);
  const [updateCount, setUpdateCount] = useState(0);

  // Initialize points with timestamps
  useEffect(() => {
    const time = formatTime();
    setPoints(
      initialCorrosionPoints.map((p) => ({
        ...p,
        lastUpdate: time,
      }))
    );
    setLastGlobalUpdate(time);
  }, []);

  // Real-time data simulation
  const updateData = useCallback(() => {
    const time = formatTime();
    setPoints((currentPoints) =>
      currentPoints.map((point) => {
        // 30% chance to update each point
        if (Math.random() > 0.3) return point;

        const baseValue = initialCorrosionPoints.find((p) => p.id === point.id)?.value ?? point.value;
        const newValue = generateVariation(baseValue, 8);
        const newLevel = determineLevel(newValue);

        return {
          ...point,
          value: newValue,
          level: newLevel,
          lastUpdate: time,
        };
      })
    );
    setLastGlobalUpdate(time);
    setUpdateCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(updateData, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, [isLive, updateData]);

  // Calculate summary stats
  const stats = {
    total: points.length,
    critico: points.filter((p) => p.level === "critico").length,
    moderado: points.filter((p) => p.level === "moderado").length,
    leve: points.filter((p) => p.level === "leve").length,
  };

  // Group points by city
  const pointsByCity = points.reduce((acc, point) => {
    if (!acc[point.city]) {
      acc[point.city] = [];
    }
    acc[point.city].push(point);
    return acc;
  }, {} as Record<string, CorrosionPoint[]>);

  return (
    <div className="flex flex-col gap-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Mapa de Zonas - Monitoreo en Tiempo Real
          </h2>
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isLive ? "bg-success" : "bg-muted-foreground"
            )} />
            <span className="text-sm text-muted-foreground">
              {isLive ? "En vivo" : "Pausado"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">
            Última actualización: {lastGlobalUpdate}
          </span>
          <button
            type="button"
            onClick={() => setIsLive(!isLive)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              isLive
                ? "bg-success/10 text-success border border-success/30 hover:bg-success/20"
                : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted"
            )}
          >
            <Wifi className="w-4 h-4" />
            {isLive ? "Detener" : "Reanudar"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Puntos</p>
                <p className="text-2xl font-bold text-foreground font-mono">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-critical/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Crítico</p>
                <p className="text-2xl font-bold text-critical font-mono">{stats.critico}</p>
              </div>
              <span className="w-4 h-4 rounded-full bg-critical animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-warning/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Moderado</p>
                <p className="text-2xl font-bold text-warning font-mono">{stats.moderado}</p>
              </div>
              <span className="w-4 h-4 rounded-full bg-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-success/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Leve</p>
                <p className="text-2xl font-bold text-success font-mono">{stats.leve}</p>
              </div>
              <span className="w-4 h-4 rounded-full bg-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Map Card */}
        <Card className="col-span-2 glass-card border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Colombia - Distribución de Sensores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[500px] rounded-xl overflow-hidden border border-border/30">
              <LeafletMap points={points} />
              
              {/* Legend overlay */}
              <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2 p-3 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-1">Nivel de Corrosión</p>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-critical animate-pulse" />
                  <span className="text-xs text-foreground">Crítico (60-100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-xs text-foreground">Moderado (30-59%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs text-foreground">Leve (0-29%)</span>
                </div>
              </div>

              {/* Update indicator */}
              <div className="absolute top-4 right-4 z-[1000] px-2 py-1 rounded bg-card/90 backdrop-blur-sm border border-border/50">
                <div className="flex items-center gap-2">
                  <RefreshCw className={cn(
                    "w-3 h-3 text-primary",
                    isLive && "animate-spin"
                  )} />
                  <span className="text-xs text-muted-foreground font-mono">
                    {updateCount} actualizaciones
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* City List */}
        <Card className="glass-card border-border/50 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Puntos por Ciudad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[540px] overflow-y-auto">
            {Object.entries(pointsByCity).map(([city, cityPoints]) => {
              const cityCritico = cityPoints.filter((p) => p.level === "critico").length;
              const cityModerado = cityPoints.filter((p) => p.level === "moderado").length;
              const cityLeve = cityPoints.filter((p) => p.level === "leve").length;
              
              return (
                <div
                  key={city}
                  className="p-4 rounded-xl bg-muted/30 border border-border/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{city}</p>
                      <p className="text-xs text-muted-foreground">{cityPoints.length} sensores</p>
                    </div>
                    <div className="flex gap-2">
                      {cityCritico > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-critical/10 text-critical text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-critical" />
                          {cityCritico}
                        </span>
                      )}
                      {cityModerado > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                          {cityModerado}
                        </span>
                      )}
                      {cityLeve > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          {cityLeve}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Individual points */}
                  <div className="space-y-2">
                    {cityPoints.map((point) => (
                      <div
                        key={point.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-background/50"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              point.level === "critico" && "bg-critical animate-pulse",
                              point.level === "moderado" && "bg-warning",
                              point.level === "leve" && "bg-success"
                            )}
                          />
                          <div>
                            <p className="text-xs font-medium text-foreground">{point.name}</p>
                            <p className="text-[10px] text-muted-foreground">{point.asset}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "text-sm font-bold font-mono",
                              point.level === "critico" && "text-critical",
                              point.level === "moderado" && "text-warning",
                              point.level === "leve" && "text-success"
                            )}
                          >
                            {point.value}%
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {point.lastUpdate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
