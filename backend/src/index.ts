import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "ig-tracker backend is running!" });
});

app.get("/users", async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/snapshots", async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("snapshots")
    .select("*")
    .order("taken_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password, instagram_user_id } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password are required" });

  const { data: existing } = await supabase.from("users").select("id").eq("username", username).maybeSingle();
  if (existing) return res.status(409).json({ error: "Username already taken" });

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert({ username, password_hash, instagram_user_id: instagram_user_id ?? "" })
    .select("id, username, instagram_user_id, created_at")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ user: data });
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password are required" });

  const { data, error } = await supabase
    .from("users")
    .select("id, username, instagram_user_id, created_at, password_hash")
    .eq("username", username)
    .single();

  if (error || !data) return res.status(401).json({ error: "Invalid username or password" });

  const valid = await bcrypt.compare(password, data.password_hash ?? "");
  if (!valid) return res.status(401).json({ error: "Invalid username or password" });

  const { password_hash: _, ...user } = data;
  res.json({ user });
});

app.patch("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, instagram_user_id, password } = req.body;

  const updates: Record<string, string> = {};
  if (username?.trim()) updates.username = username.trim();
  if (instagram_user_id !== undefined) updates.instagram_user_id = instagram_user_id.trim();
  if (password?.trim()) updates.password_hash = await bcrypt.hash(password.trim(), 10);

  if (Object.keys(updates).length === 0)
    return res.status(400).json({ error: "Nothing to update" });

  if (updates.username) {
    const { data: existing } = await supabase
      .from("users").select("id").eq("username", updates.username).maybeSingle();
    if (existing && existing.id !== id)
      return res.status(409).json({ error: "Username already taken" });
  }

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select("id, username, instagram_user_id, created_at")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ user: data });
});

app.get("/post-stats", async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("post_stats").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
