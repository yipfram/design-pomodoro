import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState } from '../types';

const STORAGE_KEY = 'zen-pomodoro-timer-state';
const CHANNEL_NAME = 'zen-pomodoro-sync';

interface SyncMessage {
  type: 'state-update' | 'request-sync';
  state?: TimerState;
  timestamp: number;
}

/**
 * Hook that synchronizes timer state across browser tabs/windows
 * Uses BroadcastChannel API for real-time sync and localStorage for persistence
 * Uses timestamp-based approach to avoid race conditions between tabs
 */
export function useSyncedTimerState(initialState: TimerState) {
  // Load initial state from localStorage or use provided initial state
  const [timerState, setTimerState] = useState<TimerState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Recalculate timeLeft based on endTime for accuracy
        if (parsed.endTime && parsed.isRunning) {
          const now = Date.now();
          const remaining = Math.max(0, Math.ceil((parsed.endTime - now) / 1000));
          parsed.timeLeft = remaining;
        }
        return parsed;
      }
    } catch (error) {
      console.error('Error loading timer state from localStorage:', error);
    }
    return initialState;
  });

  const channelRef = useRef<BroadcastChannel | null>(null);
  const isUpdatingFromSync = useRef(false);
  const updateIntervalRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const prevStateRef = useRef<TimerState>(timerState);

  // Timer tick effect - updates timeLeft based on endTime
  useEffect(() => {
    if (timerState.isRunning && timerState.endTime) {
      updateIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((timerState.endTime! - now) / 1000));

        setTimerState((prev) => ({
          ...prev,
          timeLeft: remaining,
        }));
      }, 100); // Update every 100ms for smooth display

      return () => {
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
          updateIntervalRef.current = null;
        }
      };
    } else {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    }
  }, [timerState.isRunning, timerState.endTime]);

  // Initialize BroadcastChannel
  useEffect(() => {
    try {
      // Check if BroadcastChannel is supported
      if (typeof BroadcastChannel === 'undefined') {
        console.warn('BroadcastChannel API not supported. Cross-tab sync disabled.');
        return;
      }

      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;

      // Listen for messages from other tabs
      channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        try {
          const message = event.data;

          if (message.type === 'state-update' && message.state) {
            // Update local state from other tab
            isUpdatingFromSync.current = true;

            // Recalculate timeLeft based on endTime for accuracy
            const updatedState = { ...message.state };
            if (updatedState.endTime && updatedState.isRunning) {
              const now = Date.now();
              const remaining = Math.max(0, Math.ceil((updatedState.endTime - now) / 1000));
              updatedState.timeLeft = remaining;
            }

            setTimerState(updatedState);

            // Also update localStorage to ensure persistence
            localStorage.setItem(STORAGE_KEY, JSON.stringify(message.state));
          } else if (message.type === 'request-sync') {
            // Another tab is requesting current state (e.g., newly opened tab)
            // Send current state back
            channel.postMessage({
              type: 'state-update',
              state: timerState,
              timestamp: Date.now(),
            } as SyncMessage);
          }
        } catch (error) {
          console.error('Error processing sync message:', error);
        } finally {
          isUpdatingFromSync.current = false;
        }
      };

      // Request sync from other tabs when this tab loads
      channel.postMessage({
        type: 'request-sync',
        timestamp: Date.now(),
      } as SyncMessage);

      // Cleanup on unmount
      return () => {
        channel.close();
      };
    } catch (error) {
      console.error('Error initializing BroadcastChannel:', error);
    }
  }, []); // Empty dependency array - only run once on mount

  // Persist to localStorage and broadcast to other tabs when state changes
  useEffect(() => {
    // Don't broadcast if this update came from another tab
    if (isUpdatingFromSync.current) {
      return;
    }

    // Check if only timeLeft changed (from timer tick) - don't broadcast in that case
    // Only broadcast when important fields change: isRunning, isBreak, currentTaskId, endTime
    const prev = prevStateRef.current;
    const onlyTimeLeftChanged =
      timerState.isRunning === prev.isRunning &&
      timerState.isBreak === prev.isBreak &&
      timerState.currentTaskId === prev.currentTaskId &&
      timerState.endTime === prev.endTime &&
      timerState.timeLeft !== prev.timeLeft;

    prevStateRef.current = timerState;

    try {
      // Always save to localStorage for persistence
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timerState));

      // Don't broadcast on initial mount - wait for sync with other tabs first
      // This prevents a new tab from overwriting the state of existing tabs
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      // Don't broadcast if only timeLeft changed (timer tick)
      // Each tab calculates its own timeLeft based on endTime
      if (onlyTimeLeftChanged) {
        return;
      }

      // Broadcast to other tabs (only after initial mount and for real state changes)
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: 'state-update',
          state: timerState,
          timestamp: Date.now(),
        } as SyncMessage);
      }
    } catch (error) {
      console.error('Error syncing timer state:', error);
    }
  }, [timerState]);

  // Listen for storage events (fallback for browsers without BroadcastChannel)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          isUpdatingFromSync.current = true;
          setTimerState(newState);
        } catch (error) {
          console.error('Error parsing storage event:', error);
        } finally {
          isUpdatingFromSync.current = false;
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Wrapped setter that handles errors and calculates endTime
  const updateTimerState = useCallback((update: Partial<TimerState> | ((prev: TimerState) => TimerState)) => {
    try {
      setTimerState((prev) => {
        const newState = typeof update === 'function' ? update(prev) : { ...prev, ...update };

        // Calculate endTime when timer starts
        if (newState.isRunning && !prev.isRunning) {
          const now = Date.now();
          newState.endTime = now + newState.timeLeft * 1000;
        }

        // Clear endTime when timer stops
        if (!newState.isRunning && prev.isRunning) {
          newState.endTime = null;
        }

        return newState;
      });
    } catch (error) {
      console.error('Error updating timer state:', error);
    }
  }, []);

  return [timerState, updateTimerState] as const;
}
