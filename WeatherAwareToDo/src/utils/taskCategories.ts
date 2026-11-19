
import type { TaskCategory } from "../types/Todo";

export function getTaskCategory(
  categories: Record<number, TaskCategory>,
  taskId: number
): TaskCategory {
  return categories[taskId] ?? "unspecified";
}
