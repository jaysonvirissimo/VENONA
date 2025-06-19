import React, { useReducer, useState, useEffect } from 'react';
import useMorseDecoder from '../hooks/useMorseDecoder';
import { morseToChar } from '../utils/morseMap';
import { gameReducer, initial } from '../reducers/gameReducer';

export default function Game() {
  const [state, dispatch] = useReducer(gameReducer, initial());
  const [currentMorse, setCurrentMorse] = useState('');
  const [isKeying, setIsKeying] = useState(false);
  const [debugLog, setDebugLog] = useState([]);

  const addDebugLog = (message) => {
    console.log('DEBUG:', message);
    setDebugLog(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useMorseDecoder((code) => {
    addDebugLog(`Received Morse code: ${code}`);
    const char = morseToChar[code] || '?';
    addDebugLog(`Mapped to character: ${char}`);
    dispatch({ type: 'LETTER', typed: char });
  }, setCurrentMorse, setIsKeying);

  // Test keydown events directly
  useEffect(() => {
    const testKeyDown = (e) => {
      if (e.code === 'Space') {
        addDebugLog('Space key detected in Game component');
      }
    };
    window.addEventListener('keydown', testKeyDown);
    return () => window.removeEventListener('keydown', testKeyDown);
  }, []);

  const { target, cursor, hits, total, start } = state;
  const done = cursor >= target.length;
  const accuracy = total > 0 ? (hits / total * 100).toFixed(1) : 0;
  const wpm =
    done && total
      ? ((hits / 5) * 60) / ((performance.now() - start) / 1000)
      : null;

  // Get the current target character
  const currentTargetChar = target[cursor] || '';
  const currentTargetMorse = Object.entries(morseToChar)
    .find(([morse, char]) => char === currentTargetChar)?.[0] || '';

  return (
    <div className="p-8 font-mono text-xl">
      <h1 className="text-3xl font-bold mb-6">VENONA Morse Operator</h1>

      {/* Debug panel */}
      <div className="mb-4 p-3 bg-gray-800 text-white text-xs rounded">
        <p className="font-bold mb-1">Debug Log:</p>
        {debugLog.map((log, i) => (
          <p key={i} className="font-mono">{log}</p>
        ))}
        <p className="mt-2 text-yellow-300">Click here first to focus, then press SPACE</p>
      </div>

      {/* Target text display */}
      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-2">Message to transmit:</p>
        <p style={{ fontFamily: 'monospace', fontSize: '1.5rem' }}>
          {target.split('').map((ch, i) => (
            <span
              key={i}
              style={{
                color: i < cursor ? 'green' : i === cursor ? 'black' : '#999',
                backgroundColor: i === cursor ? '#ffeb3b' : 'transparent',
                padding: i === cursor ? '2px 4px' : '0',
                borderRadius: i === cursor ? '3px' : '0',
                fontWeight: i === cursor ? 'bold' : 'normal'
              }}
            >
              {ch}
            </span>
          ))}
        </p>
      </div>

      {/* Current character helper */}
      {!done && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next character:</p>
              <p className="text-2xl font-bold">{currentTargetChar}</p>
              <p className="text-sm text-gray-500">Morse: {currentTargetMorse}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">You're typing:</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold min-w-[100px] text-left">
                  {currentMorse || '—'}
                </p>
                {isKeying && (
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {currentMorse ? morseToChar[currentMorse] || '?' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress stats */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Progress</p>
          <p className="text-lg font-bold">{cursor}/{target.length}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Accuracy</p>
          <p className="text-lg font-bold">{accuracy}%</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Attempts</p>
          <p className="text-lg font-bold">{total}</p>
        </div>
      </div>

      {/* Instructions or completion message */}
      <div className="mt-4">
        {done ? (
          <div className="text-center p-6 bg-green-50 rounded">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Level complete!
            </h2>
            <p className="text-lg mb-4">
              Accuracy: {accuracy}% – WPM: {wpm.toFixed(1)}
            </p>
            <button
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => dispatch({ type: 'NEXT_LEVEL' })}
            >
              Next level →
            </button>
          </div>
        ) : (
          <div className="text-center p-4 bg-blue-50 rounded">
            <p className="text-blue-800">
              Key the message using <strong>SPACE</strong>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Tap = dot (·) | Hold = dash (–)
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Pause to complete each letter
            </p>
          </div>
        )}
      </div>

      {/* Morse reference (optional - remove if too cluttered) */}
      <details className="mt-8">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          Morse Code Reference
        </summary>
        <div className="mt-2 grid grid-cols-6 gap-2 text-xs">
          {Object.entries(morseToChar).map(([morse, char]) => (
            <div key={morse} className="flex justify-between p-1 bg-gray-50 rounded">
              <span className="font-bold">{char}</span>
              <span className="text-gray-500">{morse}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
