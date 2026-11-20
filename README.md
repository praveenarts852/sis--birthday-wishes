# A Little World of Birthday Surprises

A six-stage birthday scrapbook for Then. Built with HTML, CSS and vanilla JavaScript, hosted on GitHub Pages, with a Cloudflare Worker checking the secret text answer.

## Quick start

1. Edit `js/config.js` (name, date, question, letter, captions, song details and Worker URL).
2. Add your own files using the filenames in `assets/`.
3. Deploy `cloudflare-worker/worker.js` as a Cloudflare Worker and set its secrets (see `SETUP.md`).
4. Put the deployed Worker URL into `workerUrl` in `js/config.js`.
5. Push the project to GitHub and enable GitHub Pages.

## Personalise

- Main image: `assets/images/main-photo.jpg`
- Twelve album images: `memory-01.jpg` through `memory-12.jpg`
- Video: `assets/video/birthday-memory.mp4`
- Song: `assets/audio/favourite-song.mp3`
- Text and captions: `js/config.js`

## Privacy

GitHub Pages files are public. The Worker checks the secret answer and issues a signed, time-limited session token for the browser journey. The token is stored in `sessionStorage`, so it normally disappears when the tab/session ends. This does **not** make public image, video, or audio URLs private. Do not upload media that must remain confidential. For actual privacy, serve media from private object storage (for example Cloudflare R2) through a Worker that validates the session token before returning each file.

## Local preview

Open `index.html` through a local static web server rather than `file://` if you want to test the Worker fetch. For example, from this folder run `python3 -m http.server 8000`, then visit `http://localhost:8000`. Add `http://localhost:8000` to the Worker `ALLOWED_ORIGIN` while testing, then change it to your published GitHub Pages origin.
