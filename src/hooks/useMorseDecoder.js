import { useEffect } from 'react';

export default function useMorseDecoder(onLetter) {
  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/morseWorker.js', import.meta.url),
      { type: 'module' }   // vite needs this
    );

    worker.onmessage = e => onLetter(e.data);  // { t:'letter', code:'...-' }

    const kd = e => e.code === 'Space' && worker.postMessage({ t: 'keyDown', at: performance.now() });
    const ku = e => e.code === 'Space' && worker.postMessage({ t: 'keyUp',   at: performance.now() });

    window.addEventListener('keydown', kd);
    window.addEventListener('keyup',   ku);

    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup',   ku);
      worker.terminate();
    };
  }, [onLetter]);
}
