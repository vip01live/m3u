# StreamScope — IPTV Playlist Auditor

Armenian-language Next.js app for authorized checks of playlist IDs 1–3000 at https://s7.iptv-24.net/{id}/playlist.m3u8.

## Deploy
Connect this repository to Vercel and set the sensitive environment variable SCAN_PASSWORD for Production, Preview and Development. Root Directory must be streamscope. Build command is npm run build. Install command is npm install.

## Usage
Enter the SCAN_PASSWORD in the dashboard and scan an ID range. Requests are sent in batches of 10. Export detected entries as M3U or CSV. Results are saved in the current browser.

## Limitations
Keep the tab open during a scan. Results are stored locally in that browser, not in a database. Playlist metadata is used for names; no visual channel recognition is performed. HTTP 200 does not guarantee every media segment plays. Use only with operator authorization and respect rate limits.
