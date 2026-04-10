"use client";

import { cn } from "@/lib/utils";
import { User, Bell, Lock, Palette, Users, Zap, ChevronRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const settingsSections = [
  {
    id: "profile",
    label: "Perfil",
    description: "Gestionar información personal",
    icon: User,
  },
  {
    id: "notifications",
    label: "Notificaciones",
    description: "Configurar alertas y actualizaciones",
    icon: Bell,
  },
  {
    id: "security",
    label: "Seguridad",
    description: "Contraseña y autenticación",
    icon: Lock,
  },
  {
    id: "appearance",
    label: "Apariencia",
    description: "Personalizar la interfaz",
    icon: Palette,
  },
  {
    id: "team",
    label: "Equipo",
    description: "Gestionar usuarios y roles",
    icon: Users,
  },
  {
    id: "integrations",
    label: "Integraciones",
    description: "Conectar con otras herramientas",
    icon: Zap,
  },
];

const integrations = [
  { name: "SAP", connected: true, icon: "SAP" },
  { name: "Oracle", connected: true, icon: "OR" },
  { name: "Sensores IoT", connected: true, icon: "IoT" },
  { name: "Power BI", connected: true, icon: "PBI" },
  { name: "Teams", connected: false, icon: "MS" },
];

export function SettingsContent() {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Section */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 glass-card">
        <h3 className="font-semibold text-foreground mb-6">Configuración de Perfil</h3>
        
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-steel-blue/20 text-primary flex items-center justify-center text-2xl font-semibold border border-primary/20">
            OP
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  defaultValue="Carlos"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  defaultValue="Mendoza"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  defaultValue="c.mendoza@corpacero.com.co"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">Cargo</label>
                <input
                  type="text"
                  id="role"
                  defaultValue="Operador de Planta"
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden glass-card">
        <h3 className="font-semibold text-foreground p-6 pb-4">Ajustes Rápidos</h3>
        <div className="divide-y divide-border/30">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                type="button"
                className="w-full flex items-center gap-4 p-6 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{section.label}</p>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 glass-card">
        <h3 className="font-semibold text-foreground mb-6">Integraciones</h3>
        <div className="space-y-3">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/30"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                {integration.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{integration.name}</p>
                <p className="text-xs text-muted-foreground">
                  {integration.connected ? "Conectado" : "No conectado"}
                </p>
              </div>
              <Button
                variant={integration.connected ? "outline" : "default"}
                size="sm"
                className={cn(
                  integration.connected 
                    ? "bg-transparent border-border/50" 
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
              >
                {integration.connected ? "Desconectar" : "Conectar"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 glass-card">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Información del Sistema</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Versión</p>
            <p className="font-mono text-foreground">v2.4.1</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Última Actualización</p>
            <p className="font-mono text-foreground">2025-04-01</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Licencia</p>
            <p className="font-mono text-foreground">Enterprise</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Soporte</p>
            <p className="font-mono text-foreground">soporte@corpacero.com.co</p>
          </div>
        </div>
      </div>
    </div>
  );
}
