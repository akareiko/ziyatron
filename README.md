# Ziyatron

A clinical dashboard for reviewing patient EEG data through a chat interface. Clinicians pick a patient, ask questions in natural language, and get answers grounded in that patient's EEG recordings — classified by a machine learning model running on the companion [`ziyatron-server`](https://github.com/akareiko/ziyatron-server) backend.

This is the frontend: patient list and search, a per-patient chat thread, file upload/drag-and-drop for EEG recordings, and account/auth handling.

## Stack

- **Next.js** (App Router) + React 19
- **Firebase** for auth and storage
- **Socket.IO client** for realtime updates
- Tailwind CSS, Framer Motion, Spline for UI/interaction

## How it fits together

```
ziyatron (this repo)  ──HTTP/WS──>  ziyatron-server
     Next.js UI                     FastAPI + ONNX EEG model
```

The frontend talks to the backend over a REST API defined by `NEXT_PUBLIC_API_URL` (see `src/lib/api.js`) for auth, patient data, and chat, plus a socket connection for live updates.

## Running locally

```bash
npm install
# create .env.local with NEXT_PUBLIC_API_URL and your Firebase web config
npm run dev
```

Needs [`ziyatron-server`](https://github.com/akareiko/ziyatron-server) running (or a deployed instance) for anything beyond the login screen to work.

## Status

Active development project — patient list, chat, and auth flows are functional; not deployed for real clinical use.
