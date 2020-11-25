# blue-news-displays

Install packages
```
npm install
```

Start Dev Server
```
npm start
```

Build for Production
```
npm run build
```

## Rendered Display Examples
### Silverscreen
http://localhost:8080/?variant=2&list=bluecinema:weekend&cinema=Capitol&place=Lucerne&room=42

### Lobby Vertical
http://localhost:8080/?variant=3&list=bluecinema:weekend&cinema=Capitol&place=Lucerne&room=42

### Lobby Horizontal
http://localhost:8080/?variant=4&list=bluecinema:weekend&cinema=Capitol&place=Lucerne&room=42


## Changelog
```
0.0.1 - Initial setup
0.0.2 - Many updates according to first round of feedback
0.0.3 - Second round of feedback, Progress bar more prominent, Spacing between flag and title, slower animations
0.0.4 - Slowed down text and QR animations
0.0.5 - Removed no longer wanted mock slides, removed dark fade on images, centered text shadow
0.0.6 - Added variant 4 (crossfading slides), added new Mock slide for BMW
0.0.7 - Merged variant 4 into master, deleted other variants. Added 2 new variants for Lounge and Silverscreen. Made Progress Bar adjust to timePerSlide. Fixed slide count iteration.
0.0.8 - Added scale transition to QR Code in variant 2
0.0.9 - Standard is now for Lobby Landscape and Portrait, Variant 2 is now for Silverscreen. Silverscreen animation updated. Startup fixed.
0.1.0 - New Setup for Production
0.1.1 – Updated QR animation (removed glow, larger target size in variant 2)
```
