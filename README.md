# 🎂 Ultimate Birthday Celebration Website

A magical, interactive, multi-page custom birthday website built with modern HTML5, CSS3 (with multiple themes and glassmorphism), Web Audio API sound synthesis, Canvas arcade games, and confetti particle physics.

---

## 🌟 What's Included

### 1. 🏠 Grand Entrance & Main Stage (`index.html`)
- **Interactive 3D Birthday Cake**: Glowing candles that can be blown out with realistic smoke particles, applause fanfare, confetti blasts, and relight mode.
- **Ambient Floating Balloons**: Interactive balloons bobbing in the background that pop with sound effects on click/tap.
- **Celebration Hero Banner**: Age milestone ticker, customizable tagline, and instant confetti cannons.
- **Quick Festivity Portals**: Direct shortcuts to all celebration areas.

### 2. 📸 Memory Lane & Story Vault (`memories.html`)
- **Retro Cassette Mixtape Player**: Vintage tape deck with spinning reels, personalized dedication quotes, track changer, and audio playback.
- **Interactive Milestone Timeline**: Chronological journey through life chapters and highlights.
- **3D Polaroid Scrapbook Wall**: Realistic polaroids with taped pins, handwritten captions, 3D hover tilts, and a full-screen Lightbox viewer.

### 3. 🎮 Birthday Fun & Games Arena (`arcade.html`)
- **"How Well Do You Know the Birthday Star?" Trivia**: 5-question interactive quiz with score tracking, funny explanations, and an official Friendship Diploma certificate!
- **Balloon Pop Frenzy**: 30-second Canvas arcade game featuring combos, golden star balloons, gift bombs, and persistent high score tracking.
- **Wheel of Birthday Fortune**: Smooth physics spinning prize wheel for winning birthday coupons.
- **Fortune Cookie & Magic Wishing Jar**: Crack open lucky cookies with crumb animations or draw blessings from the glowing jar.
- **Birthday Emoji Match Puzzle**: 4x4 card memory game with move tracking and celebratory fanfare.

### 4. 💌 Digital Wishbook & Pinboard (`wishes.html`)
- **Interactive Sticky Notes Pinboard**: Color-coded notes with custom avatars, relationship badges, and interactive like buttons.
- **Add Wish Modal**: Allows guests/friends to post their own personalized birthday notes.
- **LocalStorage Persistence**: Added messages stay saved locally.
- **Export / Print Keepsake**: Print or save the wishboard as a PDF memory book.

### 5. 🎁 Secret Birthday Vault & Unboxing (`surprise.html`)
- **3D Interactive Gift Box**: 3-stage unboxing interaction (Untie Ribbon ➔ Tear Wrapping Paper ➔ Pop Lid with particle explosion!).
- **Grand Reveal**: Heartfelt personalized letter, collectible Birthday Privilege passes (with 1-click code copying), and unlimited fireworks finale.

---

## 🎨 Theme Switcher & Audio
- **4 Custom Themes**: *Pastel Candy* (default), *Cyber Neon* (dark mode), *Rose Gold & Champagne*, and *Sunset Glow*.
- **Pure Web Audio API Synthesizer**: Zero external audio dependencies! Real-time synthesis for party horns, balloon pops, candle blowing puffs, chimes, victory fanfares, and an 8-bit / lo-fi birthday melody.

---

## 🛠️ How to Customize

All texts, names, dates, quiz questions, memories, coupons, and fortunes are centralized in:
📂 `data/content.js`

Simply open `data/content.js` in any text editor and change:
- `celebrant.name`, `celebrant.age`, `celebrant.title`, etc.
- `timeline` milestones
- `photos` URLs and captions
- `quizQuestions` questions & options
- `wheelPrizes` & `surprise.coupons`

---

## 🚀 How to Run Locally

You can simply double-click `index.html` to open it in your web browser, or run a local web server:

```powershell
# Using Python
python -m http.server 8000

# Or using npx serve
npx serve
```
Then visit `http://localhost:8000` in your browser!
