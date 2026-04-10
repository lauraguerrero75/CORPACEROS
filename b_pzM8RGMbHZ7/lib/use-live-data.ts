"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  dashboardMetrics,
  corrosionTrends,
  zoneStats,
  incidents,
  assets,
  zones,
} from "./data";
import type { Asset, CorrosionTrend, ZoneStats } from "./types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function vary(base: number, delta: number): number {
  return clamp(base + randomInt(-delta, delta), 0, 500);
}

function varyRisk(base: number): number {
  return clamp(base + randomInt(-4, 4), 0, 100);
}

function corrosionLevel(risk: number): Asset["corrosionLevel"] {
  if (risk >= 70) return "critico";
  if (risk >= 40) return "moderado";
  return "leve";
}

function trendDir(): Asset["trend"] {
  const r = Math.random();
  if (r < 0.4) return "up";
  if (r < 0.7) return "down";
  return "stable";
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LiveMetrics {
  totalAssets: number;
  criticalAssets: number;
  moderateAssets: number;
  mildAssets: number;
  activeIncidents: number;
  resolvedThisMonth: number;
  avgResponseTime: string;
  systemUptime: number;
}

export interface LiveDashboardData {
  metrics: LiveMetrics;
  trends: CorrosionTrend[];
  zoneStats: ZoneStats[];
  assets: Asset[];
  lastUpdate: string;
  updateCount: number;
}

// ─── Base values (used as anchors to avoid drift) ────────────────────────────

const BASE_METRICS = { ...dashboardMetrics };
const BASE_TRENDS = corrosionTrends.map((t) => ({ ...t }));
const BASE_ZONE_STATS = zoneStats.map((z) => ({ ...z }));
const BASE_ASSETS = assets.map((a) => ({ ...a }));

const RESPONSE_TIMES = [
  "1.8 horas", "2.0 horas", "2.1 horas", "2.3 horas",
  "2.4 horas", "2.5 horas", "2.7 horas", "3.0 horas",
];

// ─── Main Hook ───────────────────────────────────────────────────────────────

/**
 * useLiveData — simulates real-time corrosion monitoring data.
 *
 * @param intervalMs   How often to refresh (default 5000 ms)
 * @param enabled      Pause/resume updates (default true)
 */
export function useLiveData(intervalMs = 5000, enabled = true): LiveDashboardData {
  const formatTime = () =>
    new Date().toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  // ── Live assets ────────────────────────────────────────────────────────────
  const [liveAssets, setLiveAssets] = useState<Asset[]>(
    BASE_ASSETS.map((a) => ({ ...a }))
  );

  // ── Derived metrics ────────────────────────────────────────────────────────
  const [metrics, setMetrics] = useState<LiveMetrics>({ ...BASE_METRICS });

  // ── Trend chart (last 6 months – last entry updates live) ─────────────────
  const [trends, setTrends] = useState<CorrosionTrend[]>(
    BASE_TRENDS.map((t) => ({ ...t }))
  );

  // ── Zone stats ─────────────────────────────────────────────────────────────
  const [liveZoneStats, setLiveZoneStats] = useState<ZoneStats[]>(
    BASE_ZONE_STATS.map((z) => ({ ...z }))
  );

  // ── Meta ───────────────────────────────────────────────────────────────────
  const [lastUpdate, setLastUpdate] = useState(formatTime());
  const [updateCount, setUpdateCount] = useState(0);
  const countRef = useRef(0);

  // ── Update function ────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const now = formatTime();
    countRef.current += 1;

    // 1. Update assets (60 % chance each asset gets a nudge)
    const nextAssets = BASE_ASSETS.map((base) => {
      if (Math.random() > 0.6) {
        // Return current value unchanged
        return liveAssets.find((a) => a.id === base.id) ?? { ...base };
      }
      const newRisk = varyRisk(base.riskScore);
      return {
        ...base,
        riskScore: newRisk,
        corrosionLevel: corrosionLevel(newRisk),
        trend: trendDir(),
        lastInspection: base.lastInspection, // keep date stable
      };
    });

    setLiveAssets(nextAssets);

    // 2. Derive fresh metrics from updated assets
    const criticalCount = nextAssets.filter(
      (a) => a.corrosionLevel === "critico"
    ).length;
    const moderateCount = nextAssets.filter(
      (a) => a.corrosionLevel === "moderado"
    ).length;
    const mildCount = nextAssets.filter(
      (a) => a.corrosionLevel === "leve"
    ).length;

    setMetrics({
      totalAssets: BASE_METRICS.totalAssets + randomInt(-1, 1),
      criticalAssets: clamp(criticalCount + randomInt(-1, 2), 10, 25),
      moderateAssets: clamp(moderateCount + randomInt(-2, 2), 40, 65),
      mildAssets: clamp(mildCount + randomInt(-2, 2), 160, 190),
      activeIncidents: clamp(
        BASE_METRICS.activeIncidents + randomInt(-1, 1),
        1,
        6
      ),
      resolvedThisMonth: clamp(
        BASE_METRICS.resolvedThisMonth + randomInt(0, 1),
        5,
        15
      ),
      avgResponseTime:
        RESPONSE_TIMES[randomInt(0, RESPONSE_TIMES.length - 1)],
      systemUptime: parseFloat(
        clamp(BASE_METRICS.systemUptime + (Math.random() - 0.5) * 0.1, 98.5, 100).toFixed(1)
      ),
    });

    // 3. Update the last month of the trend chart only
    setTrends((prev) => {
      const next = prev.map((t, i) => {
        if (i < prev.length - 1) return t; // keep history stable
        const base = BASE_TRENDS[i];
        return {
          ...t,
          critical: vary(base.critical, 2),
          moderate: vary(base.moderate, 3),
          mild: vary(base.mild, 4),
        };
      });
      return next;
    });

    // 4. Vary zone stats slightly
    setLiveZoneStats(
      BASE_ZONE_STATS.map((z) => ({
        ...z,
        critical: clamp(z.critical + randomInt(-1, 1), 0, 10),
        moderate: clamp(z.moderate + randomInt(-2, 2), 0, 20),
        mild: clamp(z.mild + randomInt(-2, 2), 10, 60),
      }))
    );

    setLastUpdate(now);
    setUpdateCount(countRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs, tick]);

  return {
    metrics,
    trends,
    zoneStats: liveZoneStats,
    assets: liveAssets,
    lastUpdate,
    updateCount,
  };
}