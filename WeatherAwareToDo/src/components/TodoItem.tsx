
import type Todo from "../types/Todo";
import type { TaskCategory } from "../types/Todo";
import type Weather from "../types/Weather";

import { getRecommendation } from "../utils/getRecommendation";
import { getWeatherAlert } from "../utils/getWeatherAlert";

type Props = {
  todo: Todo;
  category: TaskCategory;
  weather: Weather | null;
  onToggle: (id: number) => void;
  onCategoryChange: (
    id: number,
    category: TaskCategory
  ) => void;
  translatedTitle?: string;
};

export default function TodoItem({
  todo,
  category,
  weather,
  onToggle,
  onCategoryChange,
  translatedTitle
}: Props) {
  const severity = getWeatherAlert(weather);

  const showWarning =
    category === "outdoor" &&
    (severity === "caution" ||
      severity === "danger");

  return (
    <li className="todo-item">
      {showWarning && (
        <span
          className={`task-alert ${severity}`}
          role="img"
          aria-label={`Weather ${severity}`}
          title={`Outdoor weather: ${severity}`}
        >
          {severity === "danger" ? "🚨" : "⚠️"}
        </span>
      )}

      <div className="todo-header">
        <input
          type="checkbox"
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />

        <label
          htmlFor={`todo-${todo.id}`}
          className={
            todo.completed ? "completed" : ""
          }
        >
          {translatedTitle ?? todo.title}
        </label>
      </div>

      <p>
        Status:{" "}
        {todo.completed ? "Completed" : "Pending"}
      </p>

      <div className="category-field">
        <label htmlFor={`category-${todo.id}`}>
          Category
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
          <option value="unspecified">
            Unspecified
          </option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </div>

      {category === "outdoor" && (
        <p
          className={`recommendation ${severity}`}
          role="status"
        >
          {getRecommendation(category, weather)}
        </p>
      )}
    </li>
  );
}
