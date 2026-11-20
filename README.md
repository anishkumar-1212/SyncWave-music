# SyncWave

MERN music streaming app with standalone playback and two-device synchronization.

## Run locally

1. Start MongoDB and copy `backend/.env.example` to `backend/.env`.
2. In `backend`, run `npm install`, `npm run seed`, then `npm run dev`.
3. Copy `frontend/.env.example` to `frontend/.env`, then in `frontend` run `npm install` and `npm run dev`.
4. Open the Vite URL in two browsers/devices, create an account, select a song, then use **Connect device** to create/join a session.

The app uses public demo-audio URLs for development only. Replace these with assets you are licensed to distribute before deployment.

## Licensed catalog import

SyncWave can import up to 200 tracks at a time from Jamendo. Create an application in the [Jamendo Developer Portal](https://devportal.jamendo.com/), then set `JAMENDO_CLIENT_ID` in `backend/.env` and restart the backend. In **Your Library**, choose **Import licensed Indian-tagged music**.

The importer records the provider and license URLs for every imported song. It searches provider tags such as `indian`, `bollywood`, and `hindi`; results depend on the provider's catalog and are not a source for mainstream Bollywood recordings unless those tracks have been expressly licensed there.

To refresh automatically when the backend starts and then every 12 hours, enable `JAMENDO_AUTO_IMPORT=true`. Set `JAMENDO_IMPORT_TAGS`, `JAMENDO_IMPORT_LIMIT` (maximum 200), and `JAMENDO_AUTO_IMPORT_INTERVAL_HOURS` as needed. The import updates existing provider tracks rather than creating duplicates.
