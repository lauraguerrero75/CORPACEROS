"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { inspectionImages, zones } from "@/lib/data";
import { cn } from "@/lib/utils";
import { 
  Upload, 
  Filter, 
  X,
  MapPin,
  Calendar,
  ZoomIn,
} from "lucide-react";
import type { InspectionImage } from "@/lib/types";

type SeverityFilter = 'all' | 'critico' | 'moderado' | 'leve';

export function ImagenesContent() {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [selectedImage, setSelectedImage] = useState<InspectionImage | null>(null);

  const filteredImages = inspectionImages.filter((image) => {
    const matchesZone = selectedZone === 'all' || image.zone === selectedZone;
    const matchesSeverity = severityFilter === 'all' || image.severity === severityFilter;
    return matchesZone && matchesSeverity;
  });

  const getSeverityBadge = (level: string) => {
    const styles = {
      critico: "bg-critical/20 text-critical",
      moderado: "bg-warning/20 text-warning",
      leve: "bg-success/20 text-success",
    };
    return styles[level as keyof typeof styles] || styles.leve;
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
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-muted/40 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">Todas las zonas</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.city}>{zone.city}</option>
                  ))}
                </select>
              </div>

              {/* Severity Chips */}
              <div className="flex items-center gap-2">
                {(['all', 'critico', 'moderado', 'leve'] as SeverityFilter[]).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSeverityFilter(filter)}
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

            {/* Upload Button */}
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Upload className="w-4 h-4" />
              Subir Imagen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <Card 
            key={image.id}
            className="glass-card border-border/50 overflow-hidden card-hover group cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={image.imageUrl}
                alt={image.assetName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                type="button"
                className="absolute top-2 right-2 p-2 rounded-lg bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-4 h-4 text-foreground" />
              </button>
              <span className={cn(
                "absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase",
                getSeverityBadge(image.severity)
              )}>
                {image.severity}
              </span>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium text-foreground truncate">{image.assetName}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {image.zone}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {image.date}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <Card className="glass-card border-border/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              No hay imágenes
            </h3>
            <p className="text-sm text-muted-foreground">
              No se encontraron imágenes con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="flex gap-6 max-w-5xl w-full mx-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1 relative">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.assetName}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Metadata Panel */}
            <Card className="w-80 glass-card border-border/50 shrink-0">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Detalles de Inspección
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Activo</p>
                  <p className="text-sm font-medium text-foreground">{selectedImage.assetName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ID</p>
                  <p className="text-sm font-mono text-foreground">{selectedImage.assetId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Zona</p>
                  <p className="text-sm text-foreground">{selectedImage.zone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fecha</p>
                  <p className="text-sm font-mono text-foreground">{selectedImage.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Severidad</p>
                  <span className={cn(
                    "inline-block px-2.5 py-1 rounded-full text-xs font-medium uppercase",
                    getSeverityBadge(selectedImage.severity)
                  )}>
                    {selectedImage.severity}
                  </span>
                </div>
                {selectedImage.notes && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Notas</p>
                    <p className="text-sm text-foreground">{selectedImage.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
