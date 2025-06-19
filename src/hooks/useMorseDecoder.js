import { useEffect } from 'react';

export default function useMorseDecoder(onLetter) {
  useEffect(() => {
    // 1 — make sure Vite bundles the worker
    const worker = new Worker(
      new URL('../workers/morseWorker.js', import.meta.url),
      { type: 'module' }          // REQUIRED for Vite
    );

    // Pipe “letter” events to caller
    worker.onmessage = (e) => {
      if (e.data?.t === 'letter') onLetter(e.data.code); // send ".-" etc.
    };

    /* ---------- Low-level key handlers ---------- */
    const handleKeyDown = (e) => {
      console.log('KEY', e.code)
      if (e.code !== 'Space' || e.repeat) return;
      e.preventDefault();                               // stop page scroll
      worker.postMessage({ t: 'keyDown', at: performance.now() });
    };

    const handleKeyUp = (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      worker.postMessage({ t: 'keyUp', at: performance.now() });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    /* ---------- Cleanup ---------- */
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      worker.terminate();
    };
  }, [onLetter]);
}
