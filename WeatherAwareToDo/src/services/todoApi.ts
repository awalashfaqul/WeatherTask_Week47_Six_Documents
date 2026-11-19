import type Todo from "../types/Todo";

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");

  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }

  const todoData = (await response.json()) as Todo[];
  return todoData;
};