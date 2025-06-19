# VENONA Morse Operator

> *Learn Morse code while sending and receiving real Soviet spy traffic from WWII.*

---

## 1 · What is this?

**VENONA Morse Operator** is a browser‑based typing game built with React + Vite. You step into the shoes of a Soviet radio operator (“cipher clerk”) stationed in New York between **1942‑45**. Each level asks you to key genuine (de‑crypted) **VENONA** messages in perfect rhythm before the FBI’s direction‑finding van locks onto your signal.

* ✔️ Uses **public‑domain VENONA decrypts**—3 000+ real KGB/GRU cables released by the U.S. NSA.
* ✔️ Single‑page app: no backend, deployable to **GitHub Pages**.
* ✔️ Teaches the entire ITU Morse alphabet plus prosigns and numerals.

---

## 2 · Where do the messages come from?

The entire corpus lives at the NSA’s official site:

```
https://www.nsa.gov/Helpful-Links/NSA-FOIA/Declassification-Transparency-Initiatives/Historical-Releases/Venona/
```

Each PDF contains both the five‑digit cipher groups and a plaintext translation. At build time the game:

1. Downloads the PDFs once (see `scripts/fetch_venona.sh`).
2. Extracts the **TEXT:** section with `pdftotext`.
3. Strips bracketed gaps like `[13 groups unrecovered]`.
4. Buckets each sentence by the *hardest* letter it contains so the curriculum unlocks naturally.
5. Re‑encodes the cleaned text to dot‑dash strings (`scripts/encode_morse.rb`).

The processed JSON lives in `public/venona_levels.json` and is < 50 kB gzipped.

---

## 3 · Story arc & level map

| Act                       | Year       | Levels | New characters unlocked | Sample (trimmed) real message                                       |
| ------------------------- | ---------- | ------ | ----------------------- | ------------------------------------------------------------------- |
| **I · Initiation**        | 1942       | 1‑5    | `E T A O N`             | "Will deliver reports personally Wednesday."                        |
| **II · Building the Net** | 1943       | 6‑12   | `I S R H L D U`         | "CARLOS left Philadelphia for Portugal on *Serpa Pinto*."           |
| **III · The Bomb Leaks**  | 1944       | 13‑18  | `C M F W Y P (0‑9)`     | "Request status of ENORMOZ work on uranium apparatus."              |
| **IV · Closing In**       | early 1945 | 19‑24  | `B G V K X Q`           | "Stand‑by channel if surveillance increases."                       |
| **V · Exposure**          | late 1945  | 25‑30  | `J Z / AR SK`           | "Destroy incriminating material STOP cease all radio until recall." |

Each level sets a stricter **WPM** target and a shorter **triangulation timer**, forcing faster, more accurate keying.

---

## 4 · Core game loop

1. **Briefing** – A card shows the plaintext you must transmit plus a one‑sentence historical context.
2. **Keying phase** – Tap **Space** for `·`, hold for `–`. A 300 ms pause commits a letter.
3. **Direction‑finding bar** – Fills as time elapses; finish the message before the bar reaches 100 %.
4. **Debrief** – Shows WPM, accuracy, triangulation risk, and unlocks the next letter/level if you scored ≥ 95 %.

Optional modes:

* **Blind copy** – Audio‑only reception; type what you hear.
* **Puzzle gaps** – Guess missing words in messages marked with unrecovered groups.

---

## 5 · Tech stack

* **React 18 + Vite 5** – lightning‑fast dev server and small production bundles.
* **Web Audio API** for sidetone & static hiss.
* **Web Worker** for high‑precision key timing.
* **Tailwind CSS** for styling.
* **GitHub Actions** → **GitHub Pages** for zero‑config CI/CD.

---

## 6 · Getting started

```bash
# Clone the repo
git clone https://github.com/jaysonvirissimo/VENONA.git
cd VENONA

# Ensure you have the latest Node (uses `asdf`)
asdf install  # reads .tool-versions

# Install dependencies
npm install   # or npm / yarn

# Start the dev server
npm run dev       # http://localhost:5173
```

### Build & preview

```bash
npm run build     # output in dist/
npm run preview   # serve the production build locally
```

### Deploy

Push to `main` and GitHub Actions will build and publish automatically.
