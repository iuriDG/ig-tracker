"use client";

import { useState } from "react";
import type { User } from "./types";
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) return <LoginScreen onLogin={setUser} />;
  return <DashboardScreen user={user} onLogout={() => setUser(null)} />;
}
