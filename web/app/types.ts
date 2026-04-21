export type User = {
  id: string;
  username: string;
  instagram_user_id: string;
  created_at: string;
};

export type Snapshot = {
  id: string;
  user_id: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  taken_at: string;
};
