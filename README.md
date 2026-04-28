<p align="center">
  <img src="images/ig-tracker.png" alt="Your project description" width="400">
</p>
# ig-tracker

Instagram stats tracker - Next.js web app + React Native (Expo) mobile app, backed by an Express API and Supabase.

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

Mobile runs natively (not in Docker) because Expo needs direct access to your machine's network to reach a simulator or device.

```bash
cd mobile
npm install
npx expo start
```

**iOS Simulator (macOS):** press `i` after the dev server starts. `BASE_URL` in `App.tsx` stays as `http://localhost:3000`.

**Android Emulator (Windows/macOS):**

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → **More Actions → Virtual Device Manager**
3. Click **Create Device** → pick **Pixel 6** → Next
4. Download **API 34 (Android 14)** if not already downloaded → Next → Finish
5. Click the **▶ play button** to start the emulator — wait until the home screen is fully visible
6. Run the dev server:

```bash
cd mobile
npx expo start --android
```

`BASE_URL` in `App.tsx` must be `http://10.0.2.2:3000` (Android emulator's alias for the host machine).

Find these in your Supabase project under **Settings → API**.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | List all users |
| GET | `/snapshots` | List all snapshots (latest first) |
| GET | `/post-stats` | List all post stats |
| POST | `/signup` | Create a new account |
| POST | `/login` | Sign in and get user object |
| PATCH | `/users/:id` | Update username, Instagram ID, or password |
