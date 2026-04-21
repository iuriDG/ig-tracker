import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { supabase } from "./supabase";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password are required" });

  const { data, error } = await supabase
    .from("users")
    .select("id, username, instagram_user_id, created_at, access_token")
    .eq("username", username)
    .eq("access_token", password)
    .single();

  if (error || !data) return res.status(401).json({ error: "Invalid username or password" });

  const { access_token: _, ...user } = data;
  res.json({ user });
});

app.get("/post-stats", async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("post_stats").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
