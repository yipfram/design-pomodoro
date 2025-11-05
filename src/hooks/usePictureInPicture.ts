import { useState, useCallback, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';

// Type definitions for Document Picture-in-Picture API
interface DocumentPictureInPictureAPI {
  requestWindow(options?: {
    width?: number;
    height?: number;
  }): Promise<Window>;
  window: Window | null;
}

declare global {
  interface Window {
    documentPictureInPicture?: DocumentPictureInPictureAPI;
  }
}

export function usePictureInPicture() {
  const [isPipActive, setIsPipActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const pipWindowRef = useRef<Window | null>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    // Check if Picture-in-Picture is supported
    setIsSupported('documentPictureInPicture' in window);
  }, []);

  const openPip = useCallback(
    async (content: React.ReactElement): Promise<boolean> => {
      if (!window.documentPictureInPicture) {
        console.warn('Picture-in-Picture not supported');
        return false;
      }

      try {
        // Request Picture-in-Picture window
        const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: 360,
          height: 420,
        });

        pipWindowRef.current = pipWindow;

        // Copy stylesheets to PiP window
        const allStylesheets = Array.from(document.styleSheets);
        allStylesheets.forEach((stylesheet) => {
          try {
            const cssRules = Array.from(stylesheet.cssRules || [])
              .map((rule) => rule.cssText)
              .join('\n');
            const style = pipWindow.document.createElement('style');
            style.textContent = cssRules;
            pipWindow.document.head.appendChild(style);
          } catch (e) {
            // Some stylesheets might not be accessible due to CORS
            // Try to link them instead
            if (stylesheet.href) {
              const link = pipWindow.document.createElement('link');
              link.rel = 'stylesheet';
              link.href = stylesheet.href;
              pipWindow.document.head.appendChild(link);
            }
          }
        });

        // Create container and render content
        const container = pipWindow.document.createElement('div');
        container.id = 'pip-root';
        pipWindow.document.body.appendChild(container);

        // Add some basic styles to PiP window body
        pipWindow.document.body.style.margin = '0';
        pipWindow.document.body.style.padding = '0';
        pipWindow.document.body.style.overflow = 'hidden';
        pipWindow.document.body.style.backgroundColor = '#F0F4F0';

        // Render React content
        rootRef.current = createRoot(container);
        rootRef.current.render(content);

        setIsPipActive(true);

        // Listen for window close
        pipWindow.addEventListener('pagehide', () => {
          setIsPipActive(false);
          pipWindowRef.current = null;
          if (rootRef.current) {
            rootRef.current.unmount();
            rootRef.current = null;
          }
        });

        return true;
      } catch (error) {
        console.error('Failed to open Picture-in-Picture:', error);
        return false;
      }
    },
    []
  );

  const closePip = useCallback(() => {
    if (pipWindowRef.current) {
      pipWindowRef.current.close();
      pipWindowRef.current = null;
    }
    if (rootRef.current) {
      rootRef.current.unmount();
      rootRef.current = null;
    }
    setIsPipActive(false);
  }, []);

  const updatePipContent = useCallback((content: React.ReactElement) => {
    if (rootRef.current && isPipActive) {
      rootRef.current.render(content);
    }
  }, [isPipActive]);

  return {
    isPipActive,
    isSupported,
    openPip,
    closePip,
    updatePipContent,
  };
}
