# ig-tracker

Instagram stats tracker — Next.js web app + React Native (Expo) mobile app, backed by an Express API and Supabase.

## Running

### Backend + Web (Docker)

Start both with a single command:

```bash
docker compose up
```

| Service | URL |
|---------|-----|
| Backend API | http://localhost:3000 |
| Web app | http://localhost:3001 |

To rebuild after code changes:

```bash
docker compose up --build
```

### Mobile

Mobile runs natively (not in Docker) because Expo needs direct access to your machine's network to reach a simulator or physical device.

```bash
cd mobile
npm install
npx expo start --clear
```

**iOS Simulator:** press `i` after the dev server starts.

**Physical device:** update `BASE_URL` in `mobile/App.tsx` to your machine's local IP (e.g. `http://192.168.x.x:3000`), then scan the QR code with Expo Go.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List all users |
| GET | `/snapshots` | List all snapshots (latest first) |
| GET | `/post-stats` | List all post stats |
| POST | `/signup` | Create a new account |
| POST | `/login` | Sign in and get user object |
| PATCH | `/users/:id` | Update username, Instagram ID, or password |
