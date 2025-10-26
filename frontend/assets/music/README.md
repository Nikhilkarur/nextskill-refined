# 🎵 Music Assets Directory

## 📁 Directory Structure
```
assets/music/
├── background-track.mp3    # Main background track for landing page
├── covers/                 # Album/track cover art (1000x1000px)
│   ├── track1-cover.jpg
│   └── track2-cover.jpg
└── tracks/                 # Additional music tracks for portfolio
    ├── track1.mp3
    └── track2.mp3
```

## 🎹 Adding Your FL Studio Tracks

### 1. **Export from FL Studio**
```
File → Export → Audio (WAV/MP3)
Settings:
- Format: MP3
- Quality: 320kbps (high quality) or 192kbps (web optimized)
- Sample Rate: 44.1kHz
- Normalize: Yes
```

### 2. **Background Track Setup**
- Export your best ambient/background track as `background-track.mp3`
- Place it in this directory: `assets/music/background-track.mp3`
- Recommended: 2-4 minute instrumental track that loops well
- Volume will be automatically set to 30% for background listening

### 3. **File Size Recommendations**
- **Background track**: 2-5MB (192kbps MP3)
- **Portfolio tracks**: 3-8MB (320kbps MP3)
- **Cover art**: <500KB (JPEG, 1000x1000px)

### 4. **Bandwidth Optimization**
Instead of local files, consider external hosting:

**SoundCloud Embed** (0 bandwidth):
```html
<iframe src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/YOUR_TRACK_ID&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=true"></iframe>
```

**YouTube Embed** (0 bandwidth):
```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&loop=1&playlist=YOUR_VIDEO_ID&controls=0"></iframe>
```

## 🚀 Current Implementation

The landing page (`index.html`) includes:
- ✅ Background music player with mute/unmute
- ✅ Auto-play on first user interaction (browser policy compliant)
- ✅ Volume control (set to 30% for ambient listening)
- ✅ Toast notifications for user feedback
- ✅ Responsive music control button

## 🔧 Usage

1. **Add your track**: Place `background-track.mp3` in this directory
2. **Test locally**: Use Python server or VS Code Live Server
3. **Deploy**: Push to GitHub, Netlify will auto-deploy

The music will automatically play when users visit your landing page! 🎵