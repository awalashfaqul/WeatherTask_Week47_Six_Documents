
import type Todo from "../types/Todo";
import type { TaskCategory } from "../types/Todo";
import type Weather from "../types/Weather";

import TodoItem from "./TodoItem";
import { getTaskCategory } from "../utils/taskCategories";

type Props = {
  todos: Todo[];
  categories: Record<number, TaskCategory>;
  weather: Weather | null;
  onToggle: (id: number) => void;
  onCategoryChange: (
    id: number,
    category: TaskCategory
  ) => void;
  translations: Record<number, string>;
};

export default function TodoList({
  todos,
  categories,
  weather,
  onToggle,
  onCategoryChange,
  translations
}: Props) {
  if (todos.length === 0) {
    return <p>No tasks match the current filter.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          category={getTaskCategory(
            categories,
            todo.id
          )}
          weather={weather}
          onToggle={onToggle}
          onCategoryChange={onCategoryChange}
          translatedTitle={translations[todo.id]}
        />
      ))}
    </ul>
  );
}
