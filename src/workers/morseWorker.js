/* Turn space-bar timings into dot/dash codes */

const DOT_MS  = 120;   // tap under this → ·
const GAP_MS  = 300;   // silence > this → letter boundary

let keyDownAt  = 0;
let buffer     = '';

self.onmessage = ({ data }) => {
  const now = data.at;

  switch (data.t) {
    case 'keyDown':
      keyDownAt = now;
      break;
    case 'keyUp': {
      const dur = now - keyDownAt;
      buffer += dur < DOT_MS ? '.' : '-';
      break;
    }
    case 'reset':
      buffer = '';
      break;
  }
};

/* poll every 50 ms to detect end-of-letter silence */
setInterval(() => {
  if (!buffer) return;
  if (performance.now() - keyDownAt > GAP_MS) {
    postMessage({ t: 'letter', code: buffer });
    buffer = '';
  }
}, 50);
