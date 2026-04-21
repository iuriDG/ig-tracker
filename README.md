# ig-tracker

Instagram stats tracker — React Native (Expo) mobile app backed by an Express API and Supabase.

## Running

### Backend

Start the API server with Docker:

```bash
docker compose up backend
```

The backend will be available at `http://localhost:3000`.

### Mobile (iOS Simulator)

In a separate terminal:

```bash
cd mobile
npm install
npx expo start --clear
```

Press `i` to open the iOS simulator.

### Mobile (Physical Device)

1. Update `BASE_URL` in `mobile/App.tsx` to your machine's local IP (e.g. `http://192.168.x.x:3000`)
2. Run `npx expo start --clear` and scan the QR code with Expo Go

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List all tracked users |
| GET | `/snapshots` | List all snapshots (latest first) |
| GET | `/post-stats` | List all post stats |
