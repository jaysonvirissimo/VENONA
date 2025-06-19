// Farnsworth timing for learning
// Characters are sent at 18 WPM but with longer gaps for 10 WPM overall
const CHARACTER_WPM = 18;    // Speed for individual dots/dashes
const OVERALL_WPM = 10;      // Overall effective speed with gaps

// Calculate timings based on standard formula: t_dit = 60 / (50 × wpm)
const DOT_MS = 1200 / CHARACTER_WPM;  // ~67ms per dit at 18 WPM

// For distinguishing dots from dashes, we need a threshold
// Traditional Morse uses 3:1 ratio, but for learning we'll be more forgiving
const DASH_THRESHOLD = DOT_MS * 2;    // ~133ms - hold longer than this for a dash

// Calculate Farnsworth gap timing
// Formula: t_fdit = (60/s_fwpm - 31*t_dit) / 19
const FARNSWORTH_UNIT = (60000 / OVERALL_WPM - 31 * DOT_MS) / 19;  // ~189ms

// Use Farnsworth timing for the gap between letters
// Standard is 3 units, but we use Farnsworth units for the gap
const LETTER_GAP_MS = 3 * FARNSWORTH_UNIT;  // ~567ms between letters

// For beginners, you might want even more forgiving timing:
// Uncomment these lines for easier mode (6 WPM character speed)
// const DOT_MS = 200;          // 6 WPM character speed
// const DASH_THRESHOLD = 300;  // 1.5x dot length
// const LETTER_GAP_MS = 600;   // Generous gap between letters

let keyDownAt   = 0;
let lastKeyUpAt = 0;
let buffer      = '';

self.onmessage = ({ data }) => {
  const now = data.at;

  if (data.t === 'keyDown') {
    keyDownAt = now;

  } else if (data.t === 'keyUp') {
    const duration = now - keyDownAt;

    // Determine if it's a dot or dash based on duration
    if (duration < DASH_THRESHOLD) {
      buffer += '.';
      console.log('DOT detected, duration:', duration, 'ms');
    } else {
      buffer += '-';
      console.log('DASH detected, duration:', duration, 'ms');
    }

    // Optional: Send intermediate buffer state for visual feedback
    postMessage({ t: 'buffer', content: buffer });

    lastKeyUpAt = now;

  } else if (data.t === 'reset') {
    buffer = '';
    postMessage({ t: 'buffer', content: '' });
  }
};

// Check periodically if we should flush the buffer
setInterval(() => {
  if (buffer && performance.now() - lastKeyUpAt > LETTER_GAP_MS) {
    console.log('FLUSH', buffer, '- Gap was', performance.now() - lastKeyUpAt, 'ms');
    postMessage({ t: 'letter', code: buffer });
    buffer = '';
    postMessage({ t: 'buffer', content: '' });
  }
}, 50);

// Debug info on startup
console.log('Morse Worker initialized with:');
console.log('- Character WPM:', CHARACTER_WPM);
console.log('- Overall WPM:', OVERALL_WPM);
console.log('- Dot duration:', DOT_MS, 'ms');
console.log('- Dash threshold:', DASH_THRESHOLD, 'ms');
console.log('- Letter gap:', LETTER_GAP_MS, 'ms');
