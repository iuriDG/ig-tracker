# ig-tracker

Instagram stats tracker — Next.js web app + React Native (Expo) mobile app, backed by an Express API and Supabase.

## Running

### 1. Backend

Start the API server with Docker:

```bash
docker compose up backend
```

The backend will be available at `http://localhost:3000`.

### 2. Web App

In a separate terminal:

```bash
cd web
npm install
```

Create the environment file:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.  
(Next.js uses port 3001 automatically if 3000 is already taken by the backend.)

### 3. Mobile (iOS Simulator)

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
| GET | `/users` | List all users |
| GET | `/snapshots` | List all snapshots (latest first) |
| GET | `/post-stats` | List all post stats |
| POST | `/signup` | Create a new account |
| POST | `/login` | Sign in and get user object |
| PATCH | `/users/:id` | Update username, Instagram ID, or password |
