
import { useEffect, useState } from "react";

import UserSelector from "./components/UserSelector";
import TodoList from "./components/TodoList";
import WeatherDashboard from "./components/WeatherDashboard";

import { getUsers } from "./services/userApi";
import { getTodos } from "./services/todoApi";
import { getWeather } from "./services/weatherApi";

import type User from "./types/User";
import type Todo from "./types/Todo";
import type Weather from "./types/Weather";
import type { TaskCategory } from "./types/Todo";

type TaskFilter = "all" | "active" | "completed";

export default function App() {
  // USERS
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  // TASKS
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [todosError, setTodosError] = useState("");

  // NEW THURSDAY STATE
  const [categories, setCategories] =
    useState<Record<number, TaskCategory>>({});

  const [taskFilter, setTaskFilter] =
    useState<TaskFilter>("all");

  // WEATHER
  const [city, setCity] = useState("Stockholm");
  const [weather, setWeather] =
    useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] =
    useState(false);
  const [weatherError, setWeatherError] = useState("");

  // USER API
  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const result = await getUsers();
        if (active) setUsers(result);
      } catch {
        if (active) {
          setUsersError("Unable to load users.");
        }
      } finally {
        if (active) setUsersLoading(false);
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  // TODO API
  useEffect(() => {
    let active = true;

    async function loadTodos() {
      try {
        const result = await getTodos();
        if (active) setTodos(result);
      } catch {
        if (active) {
          setTodosError("Unable to load tasks.");
        }
      } finally {
        if (active) setTodosLoading(false);
      }
    }

    void loadTodos();

    return () => {
      active = false;
    };
  }, []);

  // WEATHER API
  useEffect(() => {
    let active = true;

    async function loadWeather() {
      setWeatherLoading(true);
      setWeatherError("");
      setWeather(null);

      try {
        const result = await getWeather(city);
        if (active) setWeather(result);
      } catch (error) {
        if (active) {
          setWeatherError(
            error instanceof Error
              ? error.message
              : "Weather unavailable."
          );
        }
      } finally {
        if (active) setWeatherLoading(false);
      }
    }

    void loadWeather();

    return () => {
      active = false;
    };
  }, [city]);

  // THURSDAY: TOGGLE COMPLETION
  function toggleTodo(id: number): void {
    setTodos((previousTodos) =>
      previousTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  // THURSDAY: UPDATE CATEGORY
  function changeCategory(
    id: number,
    category: TaskCategory
  ): void {
    setCategories((previousCategories) => ({
      ...previousCategories,
      [id]: category
    }));
  }

  // THURSDAY: DERIVED TASK LIST
  const selectedTodos = todos.filter(
    (todo) => todo.userId === selectedUserId
  );

  const visibleTodos = selectedTodos.filter((todo) => {
    if (taskFilter === "active") {
      return !todo.completed;
    }

    if (taskFilter === "completed") {
      return todo.completed;
    }

    return true;
  });

  return (
    <main>
      <h1>WeatherTask</h1>

      <section>
        <h2>Select User</h2>

        {usersLoading && <p>Loading users...</p>}
        {usersError && <p role="alert">{usersError}</p>}

        {!usersLoading && !usersError && (
          <UserSelector
            users={users}
            selectedUserId={selectedUserId}
            onSelectUser={(id) => {
              setSelectedUserId(id);
              setTaskFilter("all");
            }}
          />
        )}
      </section>

      <section>
        <h2>Current Weather</h2>

        <label htmlFor="city">Select location:</label>

        <select
          id="city"
          value={city}
          onChange={(event) =>
            setCity(event.target.value)
          }
        >
          <option value="Stockholm">Stockholm</option>
          <option value="Gothenburg">Gothenburg</option>
          <option value="Malmo">Malmö</option>
          <option value="London">London</option>
        </select>

        {weatherLoading ? (
          <p>Loading weather...</p>
        ) : weatherError ? (
          <p role="alert">{weatherError}</p>
        ) : weather ? (
          <WeatherDashboard weather={weather} />
        ) : (
          <p>No weather available.</p>
        )}
      </section>

      <section>
        <h2>My Tasks</h2>

        {todosLoading ? (
          <p>Loading tasks...</p>
        ) : todosError ? (
          <p role="alert">{todosError}</p>
        ) : selectedUserId === null ? (
          <p>Please select a user to view tasks.</p>
        ) : (
          <>
            <div className="task-filters">
              <button
                type="button"
                aria-pressed={taskFilter === "all"}
                onClick={() => setTaskFilter("all")}
              >
                All
              </button>

              <button
                type="button"
                aria-pressed={taskFilter === "active"}
                onClick={() => setTaskFilter("active")}
              >
                Active
              </button>

              <button
                type="button"
                aria-pressed={taskFilter === "completed"}
                onClick={() => setTaskFilter("completed")}
              >
                Completed
              </button>
            </div>

            <p>
              Showing {visibleTodos.length} of{" "}
              {selectedTodos.length} tasks
            </p>

            <TodoList
              todos={visibleTodos}
              categories={categories}
              weather={weather}
              onToggle={toggleTodo}
              onCategoryChange={changeCategory}
            />
          </>
        )}
      </section>
    </main>
  );
}
