
import type Todo from "../types/Todo";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
};

export default function TodoList({ todos }: Props) {
  if (todos.length === 0) {
    return <p>No tasks found for this user.</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
