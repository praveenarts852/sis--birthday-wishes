# Setup and deployment guide

## A. Add your birthday content

Edit `js/config.js`:
- `friendName`: already set to `Then`.
- `birthdayDate`: enter the birthday date or a short date caption.
- `question`: write one friendship-related question.
- `letter`: replace the sample letter with your own words.
- `memories`: keep exactly 12 entries; edit each caption and date.
- `songTitle` and `songArtist`: set the track details.
- `workerUrl`: add the deployed Worker URL after deployment.

**The expected answer does not go in this file.** The Worker stores only its SHA-256 hash as a secret.

## B. Replace the 12 photographs

Copy your photographs into `assets/images/` and use these exact names:
- `main-photo.jpg`
- `memory-01.jpg` through `memory-12.jpg`

JPG or WebP works if you also update the corresponding `src` values in `js/config.js` (and mainPhoto). For faster loading, resize album photos to roughly 1200px on the long edge and compress them. Keep a backup of your originals. The site uses `object-fit: cover`, so photos may be cropped in the cards; the lightbox shows a larger view.

## C. Add the video

Put the video at `assets/video/birthday-memory.mp4`. Use MP4 (H.264 video + AAC audio) for broad browser support. Aim for about 15 seconds and compress it for mobile data. The next button appears only after the HTML video `ended` event. Do not add a separate skip button.

## D. Add your favourite song

Put your MP3 at `assets/audio/favourite-song.mp3`. Update `songTitle` and `songArtist` in `js/config.js`. Music does not autoplay; the visitor must press play. Only use a song file you have permission to share, or an authorised music embed.

## E. Deploy the Cloudflare Worker

1. Create/sign in to a Cloudflare account.
2. Install Wrangler (Cloudflare's CLI) and authenticate:
   `npm install -g wrangler`
   `wrangler login`
3. From the `cloudflare-worker` directory deploy:
   `wrangler deploy`
4. Generate a SHA-256 hash of the expected answer after normalising it to lowercase, trimming outer spaces, and replacing repeated whitespace with one space. Example for a chosen answer:
   `python3 -c "import hashlib,unicodedata; a='your answer'; a=' '.join(unicodedata.normalize('NFKC',a).lower().split()); print(hashlib.sha256(a.encode()).hexdigest())"`
   Replace `your answer` with the exact answer you intend to accept. This command applies the same NFKC, lowercase and whitespace normalisation as the Worker.
5. Add the answer hash as a Worker secret:
   `wrangler secret put ANSWER_HASH`
   Paste the 64-character hash when prompted.
6. Add a long random signing secret:
   `wrangler secret put SESSION_SECRET`
   Use a password manager or generate one with `openssl rand -hex 32`; paste the generated value when prompted.
7. Set the allowed website origin as a non-secret variable in the Cloudflare dashboard (Worker > Settings > Variables), named `ALLOWED_ORIGIN`. Example: `https://YOUR-GITHUB-USERNAME.github.io`. For a project site the origin is still the same host origin; do not include the repository path. For local testing use `http://localhost:8000`.
8. Redeploy if you change Worker code: `wrangler deploy`.
9. Copy the Worker URL, such as `https://birthday-surprise-verifier.YOUR-SUBDOMAIN.workers.dev`, into `workerUrl` in `js/config.js`.

The hash is not a plaintext answer, but a short/common answer can be guessed offline if someone obtains the hash. Choose a less predictable phrase. The Worker code here does not include persistent rate limiting; for a public deployment, add Cloudflare rate limiting or a Durable Object if abuse resistance matters.

## F. Publish on GitHub Pages

1. Create a new GitHub repository, for example `birthday-surprise`.
2. Upload the project files and folders to the repository root. Do not upload `.dev.vars`, `.env`, or any secret values.
3. Open repository Settings > Pages.
4. Under Build and deployment, select **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for the Pages deployment and open the URL shown by GitHub.
7. Check `workerUrl` is correct and that `ALLOWED_ORIGIN` exactly matches the GitHub Pages origin, e.g. `https://username.github.io`.

All asset paths are relative, so this works from a GitHub Pages repository subdirectory such as `/birthday-surprise/`.

## G. Test the complete journey

- Start: birthday page → click the button.
- Wrong answer: should show a friendly retry message and remain on the question page.
- Correct answer: Worker returns a signed 12-hour session token; browser stores it in `sessionStorage` and opens the album.
- Album: confirm exactly 12 photos; click each card, close the lightbox, and try previous/next.
- Video: confirm the next page is not offered until playback ends. Test the MP4 on a phone as well.
- Letter: tap the envelope and check the letter reveal.
- Song: confirm the play/pause button, progress slider, duration and visualizer.
- Refresh: this simple implementation restarts the journey from the beginning. It does not silently restore an unlocked page.

## Security and privacy notes

The browser code never contains the expected answer or signing secret. The Worker checks the answer over HTTPS and returns a signed, expiring token. This is a meaningful improvement over putting the answer in JavaScript, but it is not DRM and does not make GitHub Pages assets private.

The token currently proves that the visitor passed the question to this frontend. Since the pages and media are static/public, a determined visitor can still inspect the source or directly request media URLs. If actual media protection is required, move photographs/video/audio to a private bucket and make the Worker validate the signed token before streaming or issuing short-lived media URLs. Also add rate limiting to the verification endpoint before sharing the site widely.
