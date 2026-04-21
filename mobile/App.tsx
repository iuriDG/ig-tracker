import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BASE_URL = "http://localhost:3000";

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

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/users`).then((r) => r.json()),
      fetch(`${BASE_URL}/snapshots`).then((r) => r.json()),
    ])
      .then(([u, s]) => {
        setUsers(Array.isArray(u) ? u : []);
        setSnapshots(Array.isArray(s) ? s : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E1306C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.appTitle}>ig-tracker</Text>

      {users.map((user) => {
        const snaps = snapshots.filter((s) => s.user_id === user.id);
        const latest = snaps[0];

        return (
          <View key={user.id} style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.username[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.username}>@{user.username}</Text>

            {latest ? (
              <>
                <View style={styles.statsRow}>
                  <StatBox label="Followers" value={latest.followers_count} />
                  <StatBox label="Following" value={latest.following_count} />
                  <StatBox label="Posts" value={latest.posts_count} />
                </View>
                <Text style={styles.takenAt}>
                  Last updated {formatDate(latest.taken_at)}
                </Text>
              </>
            ) : (
              <Text style={styles.noData}>No snapshots yet</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value.toLocaleString()}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20, paddingTop: 64 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  appTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#E1306C",
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E1306C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  username: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 20 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 12,
  },
  statBox: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 22, fontWeight: "700", color: "#111" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  takenAt: { fontSize: 12, color: "#aaa" },
  noData: { color: "#aaa", fontSize: 14 },
  errorText: { color: "red", fontSize: 16 },
});
