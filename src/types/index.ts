export interface Goal {
  id: string;
  title: string;
  subtitle: string;
  gifUrl: string;
}

export interface Vote {
  userId: string;
  goalId: string;
  category: "women" | "men";
  timestamp: number;
}

export interface VoteCount {
  goalId: string;
  count: number;
}

export type Category = "women" | "men";
