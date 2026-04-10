"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { incidents } from "@/lib/data";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  User, 
  MapPin, 
  Calendar,
  Eye,
  UserPlus,
  CheckCircle,
} from "lucide-react";

type StatusFilter = 'all' | 'abierto' | 'en-progreso' | 'resuelto';

export function IncidentesContent() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredIncidents = incidents.filter((incident) => {
    if (statusFilter === 'all') return true;
    return incident.status === statusFilter;
  });

  const criticalCount = incidents.filter(i => i.severity === 'critico' && i.status !== 'resuelto').length;

  const getStatusBadge = (status: string) => {
    const styles = {
      abierto: "bg-critical/20 text-critical border-critical/30",
      'en-progreso': "bg-warning/20 text-warning border-warning/30",
      resuelto: "bg-success/20 text-success border-success/30",
    };
    return styles[status as keyof typeof styles] || styles.abierto;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      abierto: "Abierto",
      'en-progreso': "En Progreso",
      resuelto: "Resuelto",
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <div className="p-4 rounded-xl bg-critical/10 border border-critical/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-critical/20 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-5 h-5 text-critical" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-critical">
              {criticalCount} incidente{criticalCount > 1 ? 's' : ''} crítico{criticalCount > 1 ? 's' : ''} activo{criticalCount > 1 ? 's' : ''} requiere{criticalCount > 1 ? 'n' : ''} atención inmediata
            </p>
            <p className="text-sm text-critical/70">
              Revise los incidentes marcados como críticos y asigne técnicos de inmediato.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-critical/20 border-critical/30 text-critical hover:bg-critical/30"
          >
            Ver Críticos
          </Button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'abierto', 'en-progreso', 'resuelto'] as StatusFilter[]).map((filter) => {
          const count = filter === 'all' 
            ? incidents.length 
            : incidents.filter(i => i.status === filter).length;
          
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                statusFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {filter === 'all' ? 'Todos' : getStatusLabel(filter)}
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-xs",
                statusFilter === filter
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <Card 
            key={incident.id}
            className={cn(
              "glass-card border-l-4 overflow-hidden",
              incident.severity === 'critico' ? "border-l-critical" : "border-l-warning"
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-muted-foreground">{incident.id}</span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium uppercase",
                      incident.severity === 'critico' 
                        ? "bg-critical/20 text-critical" 
                        : "bg-warning/20 text-warning"
                    )}>
                      {incident.severity}
                    </span>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      getStatusBadge(incident.status)
                    )}>
                      {getStatusLabel(incident.status)}
                    </span>
                  </div>

                  {/* Asset Name */}
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    {incident.assetName}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">
                    {incident.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{incident.zone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{incident.detectedAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{incident.assignedTo}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-transparent border-border/50"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </Button>
                  {incident.status !== 'resuelto' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 bg-transparent border-border/50"
                      >
                        <UserPlus className="w-4 h-4" />
                        Asignar
                      </Button>
                      <Button 
                        size="sm" 
                        className="gap-2 bg-success/20 text-success hover:bg-success/30 border border-success/30"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Resolver
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIncidents.length === 0 && (
        <Card className="glass-card border-border/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              No hay incidentes
            </h3>
            <p className="text-sm text-muted-foreground">
              No se encontraron incidentes con el filtro seleccionado.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
