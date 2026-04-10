"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardMetrics, corrosionTrends, zoneStats, incidents, assets } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Shield, Activity, Box } from "lucide-react";

const pieData = [
  { name: "Crítico", value: dashboardMetrics.criticalAssets, color: "#EF4444" },
  { name: "Moderado", value: dashboardMetrics.moderateAssets, color: "#F59E0B" },
  { name: "Leve", value: dashboardMetrics.mildAssets, color: "#22C55E" },
];

export function DashboardContent() {
  const recentIncidents = incidents.slice(0, 5);
  const criticalAssets = assets.filter(a => a.corrosionLevel === 'critico').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          title="Total Activos Monitoreados"
          value={dashboardMetrics.totalAssets}
          icon={Box}
          trend={{ value: 3.2, direction: "up" }}
          glowClass=""
        />
        <KPICard
          title="Activos en Estado Crítico"
          value={dashboardMetrics.criticalAssets}
          icon={AlertTriangle}
          trend={{ value: 12.5, direction: "up" }}
          glowClass="glow-critical"
          valueColor="text-critical"
        />
        <KPICard
          title="Activos en Estado Moderado"
          value={dashboardMetrics.moderateAssets}
          icon={Activity}
          trend={{ value: 5.3, direction: "up" }}
          glowClass="glow-warning"
          valueColor="text-warning"
        />
        <KPICard
          title="Activos en Estado Leve"
          value={dashboardMetrics.mildAssets}
          icon={Shield}
          trend={{ value: 2.1, direction: "down" }}
          glowClass="glow-success"
          valueColor="text-success"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-5 gap-6">
        {/* Line Chart - Corrosion Evolution */}
        <Card className="col-span-3 glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Evolución de Corrosión – Últimos 6 meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={corrosionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6B7280" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                  }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="critical" 
                  stroke="#EF4444" 
                  strokeWidth={2.5}
                  dot={{ fill: '#EF4444', strokeWidth: 0, r: 4 }}
                  name="Crítico"
                />
                <Line 
                  type="monotone" 
                  dataKey="moderate" 
                  stroke="#F59E0B" 
                  strokeWidth={2.5}
                  dot={{ fill: '#F59E0B', strokeWidth: 0, r: 4 }}
                  name="Moderado"
                />
                <Line 
                  type="monotone" 
                  dataKey="mild" 
                  stroke="#22C55E" 
                  strokeWidth={2.5}
                  dot={{ fill: '#22C55E', strokeWidth: 0, r: 4 }}
                  name="Leve"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Distribution */}
        <Card className="col-span-2 glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Distribución Actual por Nivel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground font-mono">{dashboardMetrics.totalAssets}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium text-foreground font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Info Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Bar Chart - Corrosion by Zone */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Corrosión por Zona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={zoneStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={11} tickLine={false} />
                <YAxis 
                  dataKey="zone" 
                  type="category" 
                  stroke="#6B7280" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={85}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="critical" stackId="a" fill="#EF4444" name="Crítico" radius={[0, 0, 0, 0]} />
                <Bar dataKey="moderate" stackId="a" fill="#F59E0B" name="Moderado" />
                <Bar dataKey="mild" stackId="a" fill="#22C55E" name="Leve" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Últimos Incidentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentIncidents.map((incident) => (
              <div 
                key={incident.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg bg-muted/30 border-l-2",
                  incident.severity === 'critico' ? "border-l-critical" : "border-l-warning"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-medium rounded-full uppercase",
                      incident.severity === 'critico' 
                        ? "bg-critical/20 text-critical" 
                        : "bg-warning/20 text-warning"
                    )}>
                      {incident.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">{incident.zone}</span>
                  </div>
                  <p className="text-sm text-foreground mt-1 truncate">{incident.assetName}</p>
                  <p className="text-xs text-muted-foreground">{incident.detectedAt} • {incident.id}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Critical Alerts Panel */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-critical" />
              Activos Críticos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalAssets.map((asset) => (
              <div 
                key={asset.id}
                className="p-3 rounded-lg bg-critical/5 border border-critical/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.zone}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-critical/20 text-critical uppercase">
                    Crítico
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-critical/10">
                  <span className="text-xs text-muted-foreground">
                    Última inspección: {asset.lastInspection}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-critical font-mono">
                      {asset.riskScore}%
                    </span>
                    {asset.trend === 'up' && <TrendingUp className="w-3 h-3 text-critical" />}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend: { value: number; direction: "up" | "down" | "neutral" };
  glowClass?: string;
  valueColor?: string;
}

function KPICard({ title, value, icon: Icon, trend, glowClass, valueColor }: KPICardProps) {
  return (
    <Card className={cn("glass-card border-border/50 card-hover relative overflow-hidden", glowClass)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className={cn("text-3xl font-bold font-mono", valueColor || "text-foreground")}>
              {value}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          {trend.direction === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 text-critical" />
          ) : trend.direction === "down" ? (
            <TrendingDown className="w-3.5 h-3.5 text-success" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          <span className={cn(
            "text-xs font-medium",
            trend.direction === "up" ? "text-critical" : trend.direction === "down" ? "text-success" : "text-muted-foreground"
          )}>
            {trend.value}% vs mes anterior
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
