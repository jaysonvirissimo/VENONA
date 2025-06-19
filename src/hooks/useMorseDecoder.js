import { useEffect } from 'react';

export default function useMorseDecoder(onLetter, setCurrentMorse, setIsKeying) {
  useEffect(() => {
    // 1 — make sure Vite bundles the worker
    const worker = new Worker(
      new URL('../workers/morseWorker.js', import.meta.url),
      { type: 'module' }          // REQUIRED for Vite
    );

    // Handle messages from worker
    worker.onmessage = (e) => {
      console.log('Worker message:', e.data);
      if (e.data?.t === 'letter') {
        console.log('Letter detected:', e.data.code);
        onLetter(e.data.code); // send ".-" etc.
        // Clear the morse display after letter is sent
        if (setCurrentMorse) setCurrentMorse('');
      } else if (e.data?.t === 'buffer' && setCurrentMorse) {
        // Update the current morse pattern being typed
        setCurrentMorse(e.data.content);
      }
    };

    /* ---------- Low-level key handlers ---------- */
    const handleKeyDown = (e) => {
      console.log('KEY', e.code);
      if (e.code !== 'Space' || e.repeat) return;
      e.preventDefault();                               // stop page scroll
      worker.postMessage({ t: 'keyDown', at: performance.now() });
      if (setIsKeying) setIsKeying(true);
    };

    const handleKeyUp = (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      worker.postMessage({ t: 'keyUp', at: performance.now() });
      if (setIsKeying) setIsKeying(false);
    };

    // Also handle blur to reset keying state
    const handleBlur = () => {
      if (setIsKeying) setIsKeying(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    /* ---------- Cleanup ---------- */
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      worker.terminate();
    };
  }, [onLetter, setCurrentMorse, setIsKeying]);
}
