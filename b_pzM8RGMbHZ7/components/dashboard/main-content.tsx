"use client";

import { useState, useEffect } from "react";
import type { Section } from "@/app/page";
import { DashboardContent } from "./content/dashboard-content";
import { MapaContent } from "./content/mapa-content";
import { HistorialContent } from "./content/historial-content";
import { ReportesContent } from "./content/reportes-content";
import { IncidentesContent } from "./content/incidentes-content";
import { ImagenesContent } from "./content/imagenes-content";
import { SettingsContent } from "./content/settings-content";
import { Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainContentProps {
  activeSection: Section;
}

const sectionConfig: Record<Section, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Monitoreo en tiempo real de corrosión",
  },
  mapa: {
    title: "Mapa de Zonas",
    subtitle: "Distribución geográfica de activos",
  },
  historial: {
    title: "Historial",
    subtitle: "Registro de inspecciones y mediciones",
  },
  reportes: {
    title: "Reportes",
    subtitle: "Documentación y análisis",
  },
  incidentes: {
    title: "Incidentes",
    subtitle: "Gestión de alertas y eventos",
  },
  imagenes: {
    title: "Imágenes",
    subtitle: "Galería de inspecciones visuales",
  },
  settings: {
    title: "Configuración",
    subtitle: "Ajustes del sistema",
  },
};

export function MainContent({ activeSection }: MainContentProps) {
  const config = sectionConfig[activeSection];
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent />;
      case "mapa":
        return <MapaContent />;
      case "historial":
        return <HistorialContent />;
      case "reportes":
        return <ReportesContent />;
      case "incidentes":
        return <IncidentesContent />;
      case "imagenes":
        return <ImagenesContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            {config.title}
          </h1>
          <p className="text-sm text-muted-foreground">{config.subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/50">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground font-mono">
              {currentTime.toLocaleDateString('es-CO', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
            <span className="text-sm text-primary font-mono font-medium">
              {currentTime.toLocaleTimeString('es-CO', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
            <span className="text-sm text-success font-medium">Sistema Activo</span>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/50 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-critical text-destructive-foreground rounded-full">
              3
            </span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-background">
        <div key={activeSection} className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
