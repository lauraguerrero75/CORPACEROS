"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { assets, zones } from "@/lib/data";
import { cn } from "@/lib/utils";
import { 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
} from "lucide-react";

type SeverityFilter = 'all' | 'critico' | 'moderado' | 'leve';

export function HistorialContent() {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    const matchesZone = selectedZone === 'all' || asset.zone === selectedZone;
    const matchesSeverity = severityFilter === 'all' || asset.corrosionLevel === severityFilter;
    return matchesZone && matchesSeverity;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSeverityBadge = (level: string) => {
    const styles = {
      critico: "bg-critical/20 text-critical border-critical/30",
      moderado: "bg-warning/20 text-warning border-warning/30",
      leve: "bg-success/20 text-success border-success/30",
    };
    return styles[level as keyof typeof styles] || styles.leve;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-critical" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-success" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Zone Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedZone}
                  onChange={(e) => {
                    setSelectedZone(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">Todas las zonas</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.city}>{zone.city}</option>
                  ))}
                </select>
              </div>

              {/* Date Range (placeholder) */}
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-sm text-foreground hover:bg-muted/60 transition-colors"
              >
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Últimos 30 días</span>
              </button>

              {/* Severity Chips */}
              <div className="flex items-center gap-2">
                {(['all', 'critico', 'moderado', 'leve'] as SeverityFilter[]).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      setSeverityFilter(filter);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                      severityFilter === filter
                        ? filter === 'all' 
                          ? "bg-primary text-primary-foreground"
                          : filter === 'critico'
                            ? "bg-critical text-white"
                            : filter === 'moderado'
                              ? "bg-warning text-white"
                              : "bg-success text-white"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                    )}
                  >
                    {filter === 'all' ? 'Todos' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <Button variant="outline" size="sm" className="gap-2 bg-transparent border-border/50">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Historial de Inspecciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre del Activo</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Zona</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nivel de Corrosión</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Última Inspección</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tendencia</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssets.map((asset, index) => (
                  <tr 
                    key={asset.id}
                    className={cn(
                      "border-b border-border/30 hover:bg-muted/20 transition-colors",
                      index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                    )}
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-foreground">{asset.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">{asset.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{asset.zone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border",
                        getSeverityBadge(asset.corrosionLevel)
                      )}>
                        {asset.corrosionLevel.charAt(0).toUpperCase() + asset.corrosionLevel.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground font-mono">{asset.lastInspection}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(asset.trend)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAssets.length)} de {filteredAssets.length} registros
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-muted/40 border border-border/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/60 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/40 text-foreground hover:bg-muted/60"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-muted/40 border border-border/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/60 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
