"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reports, zones } from "@/lib/data";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  X,
  Calendar,
  FileBarChart,
  Clock,
  CheckCircle,
} from "lucide-react";

export function ReportesContent() {
  const [showModal, setShowModal] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mensual':
        return <Calendar className="w-5 h-5 text-steel-blue" />;
      case 'trimestral':
        return <FileBarChart className="w-5 h-5 text-primary" />;
      case 'anual':
        return <FileText className="w-5 h-5 text-success" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      mensual: "bg-steel-blue/20 text-steel-blue border-steel-blue/30",
      trimestral: "bg-primary/20 text-primary border-primary/30",
      anual: "bg-success/20 text-success border-success/30",
    };
    return styles[type as keyof typeof styles] || styles.mensual;
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground font-mono">{reports.length}</p>
              <p className="text-sm text-muted-foreground">Total Reportes Generados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground font-mono">Abr 01</p>
              <p className="text-sm text-muted-foreground">Último Reporte Generado</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground font-mono">2</p>
              <p className="text-sm text-muted-foreground">Revisiones Pendientes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Generate Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Biblioteca de Reportes</h2>
        <Button 
          onClick={() => setShowModal(true)}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4" />
          Generar Nuevo Reporte
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card 
            key={report.id} 
            className="glass-card border-border/50 card-hover"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
                  {getTypeIcon(report.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{report.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase",
                      getTypeBadge(report.type)
                    )}>
                      {report.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                <span className="text-xs text-muted-foreground font-mono">{report.fileSize}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    title="Vista previa"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate Report Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <Card 
            className="w-full max-w-md glass-card border-border/50 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Generar Nuevo Reporte
                </CardTitle>
                <p className="text-sm text-muted-foreground">Configure los parámetros del reporte</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Report Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tipo de Reporte</label>
                <select className="w-full px-3 py-2.5 rounded-lg bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              {/* Zone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Zona</label>
                <select className="w-full px-3 py-2.5 rounded-lg bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="all">Todas las zonas</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.city}>{zone.city}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Fecha Inicio</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Fecha Fin</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-transparent border-border/50"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setShowModal(false)}
                >
                  Generar Reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
