import levels from '../data/venona_levels.json';

export const initial = (idx = 0) => ({
  levelIdx: idx,
  target: levels.levels[idx].plaintext.toUpperCase(),
  cursor: 0,
  hits: 0,
  total: 0,
  start: performance.now(),
});

export function gameReducer(state, action) {
  switch (action.type) {
    case 'LETTER': {
      const typed = action.typed;
      const correct = typed === state.target[state.cursor];
      return {
        ...state,
        cursor: Math.min(state.cursor + 1, state.target.length),
        hits: state.hits + (correct ? 1 : 0),
        total: state.total + 1,
      };
    }
    case 'NEXT_LEVEL':
      return initial(state.levelIdx + 1);
    default:
      return state;
  }
}
