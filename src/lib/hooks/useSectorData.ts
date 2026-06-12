"use client";

import { useState, useEffect, useCallback } from "react";
import { SectorData } from "../types";
import { sectorData as mockSectorData } from "../mockData";

interface UseSectorDataResult {
  sectors: SectorData[];
  isLoading: boolean;
}

export function useSectorData(): UseSectorDataResult {
  const [sectors, setSectors] = useState<SectorData[]>(mockSectorData);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSectors = useCallback(async () => {
    try {
      const res = await fetch("/api/sectors");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setSectors(json.data);
      }
    } catch {
      // Keep current data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSectors();
    const interval = setInterval(fetchSectors, 15000);
    return () => clearInterval(interval);
  }, [fetchSectors]);

  return { sectors, isLoading };
}
