# blue-news-displays

Install packages
```
npm install
```

Env variables setup
```
cp .env.sample .env
```
And fill in your secrets.

Start Dev Server
```
npm start
```

Build for Production
```
npm run build
```

Release to target environment
```
npm run publish
```

## Rendered Display Examples

### Silverscreen
http://localhost:8080/?variant=2&list=bluecinema:weekend&cinema=Capitol&place=Lucerne&room=42

### Lobby Vertical
http://localhost:8080/?variant=3&list=bluecinema:weekend&cinema=Capitol&place=Lucerne&room=42

### Lobby Horizontal
http://localhost:8080/?variant=4&list=bluecinema:weekend&cinema=Capitol&place=Lucerne&room=42

### Live
Use http://blue-news-displays.s3-website.eu-central-1.amazonaws.com/integration/0.1.6/ instead of http://localhost:8080/

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
0.1.2 – Removed all superfluous padding on QR code, adjusted QR position to match results as seen in Visnoth's cinema video
0.1.3 – Fixed QR code positionning, added source text element to display image source
0.1.4 – Replaced gate pic with better quality
0.1.5 - Wire up source text for image with real data, try determine closest crop ratio for images
0.1.6 - Release setup and actual release
0.1.9 - Fully featured slide scheduling based on date, specific weekdays and time frames. Automatic reloading is in place once the end of the slides is reached to fetch the latest slides and metadata. Scheduling is applied on every slide transition to be as precise as possible.
0.1.10 - Load wider images based on image element width
0.1.11 - Fix crop determination and image elemnet width calculation
0.1.12 - Mind scaling of image element in slides to provide better quality images
```
