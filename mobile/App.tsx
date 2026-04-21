import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

const BASE_URL = "http://10.0.2.2:3000";

const C = {
  bg: "#07060b",
  card: "#0B1F6A",
  cardDark: "#080f35",
  blue: "#9FB6FF",
  purple: "#8A73D6",
  lavender: "#D86BEA",
  orange: "#F97316",
  white: "#FFFFFF",
  muted: "#7B8AB8",
  border: "#1a2f7a",
  green: "#4ade80",
  red: "#f87171",
};

type User = {
  id: string;
  username: string;
  instagram_user_id: string;
  created_at: string;
};

type Snapshot = {
  id: string;
  user_id: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  taken_at: string;
};

type AppTab = "dashboard" | "profiles";

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [tab, setTab] = useState<AppTab>("dashboard");

  if (!loggedInUser) return <LoginScreen onLogin={setLoggedInUser} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flex: 1 }}>
        {tab === "dashboard"
          ? <DashboardScreen user={loggedInUser} onLogout={() => setLoggedInUser(null)} />
          : <ProfilesScreen user={loggedInUser} onUpdate={setLoggedInUser} />
        }
      </View>

      {/* Bottom tab bar */}
      <View style={styles.tabBar}>
        {(["dashboard", "profiles"] as AppTab[]).map((t) => (
          <Pressable key={t} style={styles.tabBarItem} onPress={() => setTab(t)}>
            <View style={[styles.tabBarDot, tab === t && styles.tabBarDotActive]} />
            <Text style={[styles.tabBarLabel, tab === t && styles.tabBarLabelActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

type AuthMode = "signin" | "signup";

function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [igId, setIgId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function switchMode(m: AuthMode) {
    setMode(m);
    setUsername(""); setPassword(""); setConfirm(""); setIgId(""); setError(null);
  }

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) return;
    if (mode === "signup" && password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string> = { username: username.trim(), password: password.trim() };
      if (mode === "signup" && igId.trim()) body.instagram_user_id = igId.trim();
      const res = await fetch(`${BASE_URL}/${mode === "signin" ? "login" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error ?? "Something went wrong");
      else onLogin(json.user);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar barStyle="light-content" />
      <View style={styles.loginContent}>
        <Text style={styles.appTitle}>adnova</Text>
        <Text style={styles.tagline}>SMARTER INSIGHTS · FASTER GROWTH</Text>

        {/* Tab toggle */}
        <View style={styles.tabRow}>
          {(["signin", "signup"] as AuthMode[]).map((m) => (
            <Pressable key={m} style={[styles.tab, mode === m && styles.tabActive]} onPress={() => switchMode(m)}>
              <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                {m === "signin" ? "Sign In" : "Sign Up"}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.loginCard}>
          <Text style={styles.loginHeading}>{mode === "signin" ? "Welcome back" : "Create account"}</Text>
          <Text style={styles.loginSub}>
            {mode === "signin" ? "Enter your credentials to continue" : "Fill in your details to get started"}
          </Text>

          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="username"
            placeholderTextColor={C.muted}
            value={username}
            onChangeText={(t) => { setUsername(t); setError(null); }}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {mode === "signup" && (
            <TextInput
              style={styles.input}
              placeholder="instagram user id (optional)"
              placeholderTextColor={C.muted}
              value={igId}
              onChangeText={setIgId}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="password"
            placeholderTextColor={C.muted}
            value={password}
            onChangeText={(t) => { setPassword(t); setError(null); }}
            secureTextEntry
            autoCapitalize="none"
          />

          {mode === "signup" && (
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="confirm password"
              placeholderTextColor={C.muted}
              value={confirm}
              onChangeText={(t) => { setConfirm(t); setError(null); }}
              secureTextEntry
              autoCapitalize="none"
              onSubmitEditing={handleSubmit}
            />
          )}

          {mode === "signin" && (
            <View style={{ height: 0 }}>
              <TextInput onSubmitEditing={handleSubmit} style={{ height: 0, opacity: 0 }} />
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.8 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={C.white} />
              : <Text style={styles.loginBtnText}>{mode === "signin" ? "Log In" : "Create Account"}</Text>
            }
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardScreen({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/snapshots`)
      .then((r) => r.json())
      .then((s) =>
        setSnapshots(
          Array.isArray(s)
            ? s
                .filter((snap: Snapshot) => snap.user_id === user.id)
                .sort((a: Snapshot, b: Snapshot) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime())
            : []
        )
      )
      .finally(() => setLoading(false));
  }, [user.id]);

  const latest = snapshots[snapshots.length - 1];
  const prev = snapshots[snapshots.length - 2];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" />

      <View style={styles.dashHeader}>
        <View>
          <Text style={styles.appTitle}>adnova</Text>
          <Text style={styles.tagline}>SMARTER INSIGHTS · FASTER GROWTH</Text>
        </View>
        <Pressable onPress={onLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={C.blue} style={{ marginTop: 60 }} />
      ) : (
        <>
          {/* Profile */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.username[0].toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.username}>@{user.username}</Text>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Live analysis</Text>
                </View>
              </View>
            </View>

            {latest && (
              <View style={styles.statsGrid}>
                <StatCard label="Followers" value={latest.followers_count} prev={prev?.followers_count} accent={C.blue} />
                <StatCard label="Following" value={latest.following_count} prev={prev?.following_count} accent={C.purple} />
                <StatCard label="Posts" value={latest.posts_count} prev={prev?.posts_count} accent={C.lavender} />
              </View>
            )}
          </View>

          {/* Growth chart */}
          {snapshots.length > 0 && (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Follower Growth</Text>
              {latest && (
                <Text style={styles.chartSub}>
                  Latest snapshot · {formatDate(latest.taken_at)}
                </Text>
              )}
              <GrowthChart snapshots={snapshots} />
            </View>
          )}

          {/* Snapshot history */}
          {snapshots.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Snapshot History</Text>
              {[...snapshots].reverse().map((s) => (
                <View key={s.id} style={styles.historyRow}>
                  <Text style={styles.historyDate}>{formatDate(s.taken_at)}</Text>
                  <View style={styles.historyStats}>
                    <Text style={[styles.historyVal, { color: C.blue }]}>{s.followers_count.toLocaleString()}</Text>
                    <Text style={styles.historyLabel}> followers</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

// ─── Growth Chart ─────────────────────────────────────────────────────────────

function GrowthChart({ snapshots }: { snapshots: Snapshot[] }) {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 80;
  const chartHeight = 140;
  const padX = 16;
  const padY = 16;

  const revealAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    revealAnim.setValue(0);
    Animated.timing(revealAnim, {
      toValue: 1,
      duration: 1400,
      useNativeDriver: false,
    }).start();
  }, [snapshots]);

  const overlayWidth = revealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [chartWidth, 0],
  });

  const values = snapshots.map((s) => s.followers_count);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const isSingle = snapshots.length === 1;

  const points = snapshots.map((s, i) => {
    const x = isSingle
      ? chartWidth / 2
      : padX + (i / (snapshots.length - 1)) * (chartWidth - padX * 2);
    const y = isSingle
      ? chartHeight / 2
      : padY + (1 - (s.followers_count - minVal) / range) * (chartHeight - padY * 2);
    return { x, y };
  });

  const smoothPath = points.length > 1 ? buildSmoothPath(points) : "";

  const areaPath =
    points.length > 1
      ? `M ${points[0].x} ${chartHeight} ` +
        buildSmoothPath(points).slice(1) +
        ` L ${points[points.length - 1].x} ${chartHeight} Z`
      : "";

  return (
    <View style={{ width: chartWidth, height: chartHeight, marginTop: 12, overflow: "hidden" }}>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={C.blue} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={C.blue} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {areaPath ? <Path d={areaPath} fill="url(#areaGrad)" /> : null}

        {smoothPath ? (
          <Path d={smoothPath} fill="none" stroke={C.blue} strokeWidth={2.5} strokeLinecap="round" />
        ) : null}

        {isSingle && (
          <Line
            x1={padX} y1={chartHeight / 2}
            x2={chartWidth - padX} y2={chartHeight / 2}
            stroke={C.blue} strokeWidth={1} strokeDasharray="4 6" strokeOpacity={0.4}
          />
        )}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={isSingle ? 7 : 4} fill={C.bg} stroke={C.blue} strokeWidth={2.5} />
        ))}
      </Svg>

      {/* Reveal overlay — animates from right to left */}
      <Animated.View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: overlayWidth,
          backgroundColor: C.cardDark,
        }}
      />
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, prev, accent }: { label: string; value: number; prev?: number; accent: string }) {
  const delta = prev != null ? value - prev : null;
  const pct =
    delta != null && prev != null && prev !== 0 ? ((delta / prev) * 100).toFixed(1) : null;

  return (
    <View style={[styles.statCard, { borderTopColor: accent }]}>
      <Text style={[styles.statValue, { color: accent }]}>{value.toLocaleString()}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {pct != null && (
        <Text style={[styles.delta, { color: delta! >= 0 ? C.green : C.red }]}>
          {delta! >= 0 ? "+" : ""}{pct}%
        </Text>
      )}
    </View>
  );
}

function buildSmoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const cpX = (curr.x + next.x) / 2;
    d += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

function ProfilesScreen({ user, onUpdate }: { user: User; onUpdate: (u: User) => void }) {
  const [username, setUsername] = useState(user.username);
  const [igId, setIgId] = useState(user.instagram_user_id ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    if (password && password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true); setError(null);
    try {
      const body: Record<string, string> = { username: username.trim(), instagram_user_id: igId.trim() };
      if (password.trim()) body.password = password.trim();
      const res = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Update failed"); return; }
      onUpdate(json.user);
      setPassword(""); setConfirm("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <StatusBar barStyle="light-content" />
        <Text style={[styles.appTitle, { marginBottom: 4 }]}>My Profile</Text>
        <Text style={[styles.tagline, { marginBottom: 24 }]}>ACCOUNT SETTINGS</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.username[0].toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.username}>@{user.username}</Text>
              {user.instagram_user_id ? (
                <Text style={[styles.historyDate, { marginTop: 2 }]}>ID: {user.instagram_user_id}</Text>
              ) : null}
            </View>
          </View>

          {success && (
            <View style={{ backgroundColor: "#14532d", borderRadius: 8, padding: 10, marginBottom: 12 }}>
              <Text style={{ color: C.green, fontSize: 13 }}>Profile updated successfully.</Text>
            </View>
          )}

          <Text style={styles.sectionLabel}>USERNAME</Text>
          <TextInput
            style={styles.input} placeholderTextColor={C.muted}
            value={username} onChangeText={(t) => { setUsername(t); setError(null); }}
            autoCapitalize="none" autoCorrect={false}
          />

          <Text style={styles.sectionLabel}>INSTAGRAM USER ID</Text>
          <TextInput
            style={styles.input} placeholderTextColor={C.muted}
            value={igId} onChangeText={setIgId}
            autoCapitalize="none" autoCorrect={false}
          />

          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
            NEW PASSWORD <Text style={{ fontWeight: "400", fontSize: 10 }}>(leave blank to keep)</Text>
          </Text>
          <TextInput
            style={[styles.input, error && password ? styles.inputError : null]}
            placeholderTextColor={C.muted} placeholder="new password"
            value={password} onChangeText={(t) => { setPassword(t); setError(null); }}
            secureTextEntry autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, error && confirm ? styles.inputError : null]}
            placeholderTextColor={C.muted} placeholder="confirm password"
            value={confirm} onChangeText={(t) => { setConfirm(t); setError(null); }}
            secureTextEntry autoCapitalize="none"
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.8 }]}
            onPress={handleSave} disabled={loading}
          >
            {loading ? <ActivityIndicator color={C.white} /> : <Text style={styles.loginBtnText}>Save Changes</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingTop: 64, paddingBottom: 40 },
  loginContent: { flex: 1, padding: 20, justifyContent: "center" },

  appTitle: { fontSize: 36, fontWeight: "800", color: C.white, letterSpacing: -0.5 },
  tagline: { fontSize: 11, fontWeight: "600", color: C.muted, letterSpacing: 1.5, marginTop: 4 },

  tabRow: {
    flexDirection: "row", backgroundColor: C.cardDark,
    borderRadius: 12, padding: 4, marginTop: 32,
    borderWidth: 1, borderColor: C.border,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: "center" },
  tabActive: { backgroundColor: C.card },
  tabText: { fontSize: 14, fontWeight: "600", color: C.muted },
  tabTextActive: { color: C.white },

  loginCard: {
    backgroundColor: C.cardDark, borderRadius: 20,
    padding: 24, marginTop: 16, borderWidth: 1, borderColor: C.border,
  },
  loginHeading: { fontSize: 22, fontWeight: "700", color: C.white, marginBottom: 6 },
  loginSub: { fontSize: 13, color: C.muted, marginBottom: 24 },
  input: {
    backgroundColor: C.card, borderRadius: 12, padding: 14,
    color: C.white, fontSize: 16, borderWidth: 1, borderColor: C.border, marginBottom: 12,
  },
  inputError: { borderColor: C.red },
  errorText: { color: C.red, fontSize: 13, marginBottom: 12 },
  loginBtn: { backgroundColor: C.orange, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 4 },
  loginBtnText: { color: C.white, fontSize: 16, fontWeight: "700" },

  dashHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  logoutText: { color: C.muted, fontSize: 14, marginTop: 8 },

  profileCard: {
    backgroundColor: C.cardDark, borderRadius: 20,
    padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.border,
  },
  profileHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 14 },
  avatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: C.card,
    borderWidth: 2, borderColor: C.blue, alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: C.blue, fontSize: 22, fontWeight: "700" },
  username: { color: C.white, fontSize: 17, fontWeight: "600" },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  liveText: { color: C.green, fontSize: 11, fontWeight: "500" },
  statsGrid: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1, backgroundColor: C.card, borderRadius: 12,
    padding: 14, borderTopWidth: 2, alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { color: C.muted, fontSize: 11, marginTop: 4 },
  delta: { fontSize: 11, fontWeight: "600", marginTop: 4 },

  chartCard: {
    backgroundColor: C.cardDark, borderRadius: 20,
    padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.border,
  },
  chartTitle: { color: C.white, fontSize: 16, fontWeight: "700" },
  chartSub: { color: C.muted, fontSize: 11, marginTop: 3 },

  sectionCard: {
    backgroundColor: C.cardDark, borderRadius: 20,
    padding: 20, borderWidth: 1, borderColor: C.border,
  },
  sectionTitle: { color: C.white, fontSize: 16, fontWeight: "700", marginBottom: 16 },
  historyRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  historyDate: { color: C.muted, fontSize: 13 },
  historyStats: { flexDirection: "row", alignItems: "baseline" },
  historyVal: { fontSize: 15, fontWeight: "700" },
  historyLabel: { color: C.muted, fontSize: 12 },

  sectionLabel: { color: C.muted, fontSize: 11, fontWeight: "600", letterSpacing: 0.5, marginBottom: 6 },
  editBtn: {
    backgroundColor: C.card, borderRadius: 10, borderWidth: 1,
    borderColor: C.border, padding: 12, alignItems: "center",
  },
  editBtnText: { color: C.white, fontSize: 14, fontWeight: "600" },
  cancelBtn: {
    borderRadius: 10, borderWidth: 1, borderColor: C.border,
    padding: 12, paddingHorizontal: 20, alignItems: "center", justifyContent: "center",
  },
  cancelBtnText: { color: C.muted, fontSize: 14 },

  tabBar: {
    flexDirection: "row", backgroundColor: C.cardDark,
    borderTopWidth: 1, borderTopColor: C.border,
    paddingBottom: 28, paddingTop: 12,
  },
  tabBarItem: { flex: 1, alignItems: "center", gap: 4 },
  tabBarDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "transparent" },
  tabBarDotActive: { backgroundColor: C.blue },
  tabBarLabel: { fontSize: 12, fontWeight: "600", color: C.muted },
  tabBarLabelActive: { color: C.white },
});
