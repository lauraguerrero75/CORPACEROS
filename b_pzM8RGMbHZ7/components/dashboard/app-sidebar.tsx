"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Section } from "@/app/page";
import {
  LayoutDashboard,
  Map,
  History,
  FileText,
  AlertTriangle,
  Image,
  Settings,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AppSidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

interface NavItem {
  id: Section;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeColor?: "red" | "amber" | "green";
}

const mainMenu: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "mapa", label: "Mapa de Zonas", icon: Map },
  { id: "historial", label: "Historial", icon: History },
  { id: "reportes", label: "Reportes", icon: FileText },
  { id: "incidentes", label: "Incidentes", icon: AlertTriangle, badge: 3, badgeColor: "red" },
  { id: "imagenes", label: "Imágenes", icon: Image },
];

// Corrosion/Steel icon as SVG
function CorrosionIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all duration-300 relative",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Collapse Toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center hover:bg-muted transition-colors"
        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-sidebar-border",
        collapsed ? "px-4 justify-center" : "px-5 gap-3"
      )}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
          <CorrosionIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-[15px] tracking-tight">
              Corpacero
            </span>
            <span className="text-[10px] text-muted-foreground">
              Inteligencia de Corrosión
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-4 py-4">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/50 transition-colors"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground flex-1 text-left">Buscar activos...</span>
            <kbd className="text-[11px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-md border border-border/50 font-mono">
              /
            </kbd>
          </button>
        </div>
      )}

      {/* Main Menu */}
      <div className={cn("flex-1", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <p className="px-2 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Menú Principal
          </p>
        )}
        <nav className="space-y-1">
          {mainMenu.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => onSectionChange(item.id)}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      {/* Settings & User */}
      <div className={cn(
        "py-4 border-t border-sidebar-border space-y-2",
        collapsed ? "px-2" : "px-4"
      )}>
        <NavButton
          item={{ id: "settings", label: "Configuración", icon: Settings }}
          isActive={activeSection === "settings"}
          onClick={() => onSectionChange("settings")}
          collapsed={collapsed}
        />
        
        {/* User Profile */}
        <div className={cn(
          "flex items-center rounded-xl hover:bg-muted/40 transition-colors cursor-pointer",
          collapsed ? "p-2 justify-center" : "gap-3 px-2 py-3"
        )}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-steel-blue/30 flex items-center justify-center border border-primary/20">
            <span className="text-primary text-sm font-medium">OP</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Operador</p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button 
                type="button"
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

function NavButton({ item, isActive, onClick, collapsed }: NavButtonProps) {
  const Icon = item.icon;
  
  const badgeColorClass = {
    red: "bg-critical/20 text-critical",
    amber: "bg-warning/20 text-warning",
    green: "bg-success/20 text-success",
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center rounded-xl text-sm transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        collapsed ? "p-2.5 justify-center" : "gap-3 px-3 py-2.5",
        isActive
          ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
          : "text-foreground/70 hover:bg-muted/40 hover:text-foreground border-l-2 border-transparent"
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                isActive
                  ? "bg-primary/20 text-primary"
                  : item.badgeColor 
                    ? badgeColorClass[item.badgeColor]
                    : "bg-muted text-muted-foreground"
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}
