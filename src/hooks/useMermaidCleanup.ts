import { useEffect } from 'react';

export function useMermaidCleanup() {
  useEffect(() => {
    const cleanup = () => {
      document.querySelectorAll('div[id^="dmermaid-"]').forEach((el) => el.remove());
    };

    const interval = setInterval(cleanup, 2000);
    cleanup();

    return () => clearInterval(interval);
  }, []);
}