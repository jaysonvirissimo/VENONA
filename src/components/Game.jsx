import React, { useReducer } from 'react';
import useMorseDecoder from '../hooks/useMorseDecoder';
import { morseToChar } from '../utils/morseMap';
import { gameReducer, initial } from '../reducers/gameReducer';

export default function Game() {
  const [state, dispatch] = useReducer(gameReducer, initial());

  useMorseDecoder(msg => {
    if (msg.t === 'letter') {
      dispatch({ type: 'LETTER', typed: morseToChar[msg.code] || '?' });
    }
  });

  const { target, cursor, hits, total, start } = state;
  const done = cursor >= target.length;
  const wpm =
    done && total
      ? ((hits / 5) * 60) / ((performance.now() - start) / 1000)
      : null;

  return (
    <div className="p-8 font-mono text-xl">
      <p>
        {target.split('').map((ch, i) => (
          <span key={i} className={i < cursor ? 'text-green-600' : ''}>
            {ch}
          </span>
        ))}
      </p>

      <p className="mt-4">
        {done ? (
          <>
            Level complete! Accuracy {(hits / total * 100).toFixed(1)}% – WPM{' '}
            {wpm.toFixed(1)}
            <button
              className="ml-4 border px-2 py-1"
              onClick={() => dispatch({ type: 'NEXT_LEVEL' })}
            >
              Next level
            </button>
          </>
        ) : (
          'Key the message using SPACE (tap = dot, hold = dash)'
        )}
      </p>
    </div>
  );
}
