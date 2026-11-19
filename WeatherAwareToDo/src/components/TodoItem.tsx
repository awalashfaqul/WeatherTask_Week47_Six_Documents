
import type Todo from "../types/Todo";

type Props = {
  todo: Todo;
};

export default function TodoItem({ todo }: Props) {
  return (
    <li>
      <span
        style={{
          textDecoration: todo.completed
            ? "line-through"
            : "none"
        }}
      >
        {todo.title}
      </span>

      <span>
        {todo.completed ? " — Completed" : " — Pending"}
      </span>
    </li>
  );
}
