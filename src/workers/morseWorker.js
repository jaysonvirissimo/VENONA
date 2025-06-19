const DOT_MS = 120;   // tweak later
const GAP_MS = 300;

let keyDownAt   = 0;
let lastKeyUpAt = 0;
let buffer      = '';

self.onmessage = ({ data }) => {
  const now = data.at;
  if (data.t === 'keyDown') {
    keyDownAt = now;
  } else if (data.t === 'keyUp') {
    buffer += now - keyDownAt < DOT_MS ? '.' : '-';
    lastKeyUpAt = now;
  } else if (data.t === 'reset') {
    buffer = '';
  }
};

// flush after silence
setInterval(() => {
  if (buffer && performance.now() - lastKeyUpAt > GAP_MS) {
    console.log('FLUSH', buffer);          // <── must appear!
    postMessage({ t: 'letter', code: buffer });
    buffer = '';
  }
}, 50);
