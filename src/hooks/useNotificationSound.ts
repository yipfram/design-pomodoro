import { useCallback, useRef } from 'react';

/**
 * Hook to play notification sounds using Web Audio API
 * Generates pleasant notification tones without external audio files
 */
export function useNotificationSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playNotificationSound = useCallback(() => {
    try {
      // Create or reuse AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const now = audioContext.currentTime;

      // Create oscillator for the notification sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure sound: gentle bell-like tone
      oscillator.type = 'sine';

      // First note (C5)
      oscillator.frequency.setValueAtTime(523.25, now);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      // Second note (E5) - slight delay for pleasant chime effect
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();

        osc2.connect(gain2);
        gain2.connect(audioContext.destination);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, audioContext.currentTime);
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.4
        );

        osc2.start();
        osc2.stop(audioContext.currentTime + 0.4);
      }, 100);

      // Start and stop
      oscillator.start(now);
      oscillator.stop(now + 0.3);
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }, []);

  return { playNotificationSound };
}
