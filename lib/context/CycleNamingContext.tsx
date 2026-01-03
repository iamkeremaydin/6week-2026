"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CycleLabels } from '@/lib/calendar/types';

interface CycleNamingContextType {
  getCycleName: (cycleNumber: number) => string | undefined;
  setCycleName: (cycleNumber: number, name: string) => void;
  getAllCycleNames: () => CycleLabels;
}

const CycleNamingContext = createContext<CycleNamingContextType | undefined>(undefined);

const STORAGE_KEY = 'cycle-names-2026';

/**
 * Global cycle naming provider with localStorage persistence.
 * Manages user-defined cycle names that propagate across all components.
 */
export function CycleNamingProvider({ children }: { children: React.ReactNode }) {
  const [cycleNames, setCycleNames] = useState<CycleLabels>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cycle names from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCycleNames(parsed);
        }
      } catch (error) {
        console.error('Failed to load cycle names from localStorage:', error);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Save cycle names to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cycleNames));
      } catch (error) {
        console.error('Failed to save cycle names to localStorage:', error);
      }
    }
  }, [cycleNames, isInitialized]);

  const getCycleName = useCallback((cycleNumber: number): string | undefined => {
    return cycleNames[cycleNumber];
  }, [cycleNames]);

  const setCycleName = useCallback((cycleNumber: number, name: string) => {
    setCycleNames(prev => ({
      ...prev,
      [cycleNumber]: name.trim()
    }));
  }, []);

  const getAllCycleNames = useCallback((): CycleLabels => {
    return cycleNames;
  }, [cycleNames]);

  return (
    <CycleNamingContext.Provider value={{ getCycleName, setCycleName, getAllCycleNames }}>
      {children}
    </CycleNamingContext.Provider>
  );
}

/**
 * Hook to access cycle naming context.
 * Provides functions to get and set user-defined cycle names.
 */
export function useCycleNaming() {
  const context = useContext(CycleNamingContext);
  if (context === undefined) {
    throw new Error('useCycleNaming must be used within a CycleNamingProvider');
  }
  return context;
}

