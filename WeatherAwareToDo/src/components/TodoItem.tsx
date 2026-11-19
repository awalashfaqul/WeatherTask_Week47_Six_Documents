
import type Todo from "../types/Todo";
import type { TaskCategory } from "../types/Todo";
import type Weather from "../types/Weather";

import { getRecommendation } from "../utils/getRecommendation";

type Props = {
  todo: Todo;
  category: TaskCategory;
  weather: Weather | null;
  onToggle: (id: number) => void;
  onCategoryChange: (
    id: number,
    category: TaskCategory
  ) => void;
};

export default function TodoItem({
  todo,
  category,
  weather,
  onToggle,
  onCategoryChange
}: Props) {
  const recommendation = getRecommendation(
    category,
    weather
  );

  return (
    <li className="todo-item">
      <div className="todo-header">
        <input
          type="checkbox"
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />

        <label
          htmlFor={`todo-${todo.id}`}
          className={todo.completed ? "completed" : ""}
        >
          {todo.title}
        </label>
      </div>

      <p>
        Status: {todo.completed ? "Completed" : "Pending"}
      </p>

      <label htmlFor={`category-${todo.id}`}>
        Task category:
      </label>

      <select
        id={`category-${todo.id}`}
        value={category}
        onChange={(event) =>
          onCategoryChange(
            todo.id,
            event.target.value as TaskCategory
          )
        }
      >
        <option value="unspecified">Unspecified</option>
        <option value="indoor">Indoor</option>
        <option value="outdoor">Outdoor</option>
      </select>

      {category === "outdoor" && (
        <p className="recommendation" role="status">
          {recommendation}
        </p>
      )}
    </li>
  );
}
