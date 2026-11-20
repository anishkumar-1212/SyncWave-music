# SyncWave

MERN music streaming app with standalone playback and two-device synchronization.

## Run locally

1. Start MongoDB and copy `backend/.env.example` to `backend/.env`.
2. In `backend`, run `npm install`, `npm run seed`, then `npm run dev`.
3. Copy `frontend/.env.example` to `frontend/.env`, then in `frontend` run `npm install` and `npm run dev`.
4. Open the Vite URL in two browsers/devices, create an account, select a song, then use **Connect device** to create/join a session.

The app uses public demo-audio URLs for development only. Replace these with assets you are licensed to distribute before deployment.
