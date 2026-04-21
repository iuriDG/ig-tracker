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

app.get("/post-stats", async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from("post_stats").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
