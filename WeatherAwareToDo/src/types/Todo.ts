
export type TaskCategory =
  | "indoor"
  | "outdoor"
  | "unspecified";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  category?: TaskCategory;
};

export type { Todo as default };