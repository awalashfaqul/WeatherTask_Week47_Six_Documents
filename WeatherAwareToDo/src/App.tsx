
import { useEffect, useState } from "react";

import UserSelector from "./components/UserSelector";
import TodoList from "./components/TodoList";
import WeatherDashboard from "./components/WeatherDashboard";

import { getUsers } from "./services/userApi";
import { getTodos } from "./services/todoApi";
import { getWeather } from "./services/weatherApi";
import { translateTask } from "./services/translationApi";

import type { TaskLanguage } from "./services/translationApi";
import type User from "./types/User";
import type Todo from "./types/Todo";
import type Weather from "./types/Weather";
import type { TaskCategory } from "./types/Todo";

type TaskFilter = "all" | "active" | "completed";

export default function App() {
  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  // Tasks
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [todosError, setTodosError] = useState("");

  const [categories, setCategories] =
    useState<Record<number, TaskCategory>>({});

  const [taskFilter, setTaskFilter] =
    useState<TaskFilter>("all");

  // Weather
  const [cityInput, setCityInput] = useState("Stockholm");
  const [city, setCity] = useState("Stockholm");

  const [weather, setWeather] =
    useState<Weather | null>(null);

  const [weatherLoading, setWeatherLoading] =
    useState(false);

  const [weatherError, setWeatherError] = useState("");

  // Translation
  const [language, setLanguage] =
    useState<TaskLanguage>("original");

  const [translations, setTranslations] =
    useState<Record<number, string>>({});

  const [translationLoading, setTranslationLoading] =
    useState(false);

  const [translationError, setTranslationError] =
    useState("");

  // Load users
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

  // Load tasks
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

  // Load weather
  useEffect(() => {
    let active = true;

    async function loadWeather() {
      setWeatherLoading(true);
      setWeatherError("");
      setWeather(null);

      try {
        const result = await getWeather(city);
        if (active) setWeather(result);
      } catch {
        if (active) {
          setWeatherError(
            "Unable to find weather for this location."
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

  // Filter tasks by user and completion
  const selectedTodos = todos.filter(
    (todo) => todo.userId === selectedUserId
  );

  const visibleTodos = selectedTodos.filter(
    (todo) => {
      if (taskFilter === "active") {
        return !todo.completed;
      }

      if (taskFilter === "completed") {
        return todo.completed;
      }

      return true;
    }
  );

  // Translate only the selected user's tasks.
  // Cache translations for each language.
  useEffect(() => {
    let active = true;

    if (
      language === "original" ||
      selectedTodos.length === 0
    ) {
      setTranslations({});
      setTranslationLoading(false);
      setTranslationError("");
      return;
    }

    async function loadTranslations() {
      setTranslationLoading(true);
      setTranslationError("");
      setTranslations({});

      try {
        const results = await Promise.all(
          selectedTodos.map(async (todo) => ({
            id: todo.id,
            title: await translateTask(
              todo.title,
              language as "en" | "sv"
            )
          }))
        );

        if (active) {
          setTranslations(
            Object.fromEntries(
              results.map((item) => [
                item.id,
                item.title
              ])
            )
          );
        }
      } catch {
        if (active) {
          setTranslationError(
            "Translation unavailable. Showing original titles."
          );
        }
      } finally {
        if (active) setTranslationLoading(false);
      }
    }

    void loadTranslations();

    return () => {
      active = false;
    };
  }, [language, selectedUserId, todos.length]);

  function toggleTodo(id: number): void {
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed
            }
          : todo
      )
    );
  }

  function changeCategory(
    id: number,
    category: TaskCategory
  ): void {
    setCategories((previous) => ({
      ...previous,
      [id]: category
    }));
  }

  function searchCity(
  event: React.SubmitEvent<HTMLFormElement>
): void {
  event.preventDefault();

  const value = cityInput.trim();

  if (value) {
    setCity(value);
  }
}

  return (
    <main className="app-container">
      <h1>WeatherTask</h1>

      <div className="app-layout">
        <div className="tasks-column">
          <section>
            <h2>Select User</h2>

            {usersLoading && (
              <p>Loading users...</p>
            )}

            {usersError && (
              <p role="alert">{usersError}</p>
            )}

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
            <h2>My Tasks</h2>

            {todosLoading ? (
              <p>Loading tasks...</p>
            ) : todosError ? (
              <p role="alert">{todosError}</p>
            ) : selectedUserId === null ? (
              <p>
                Please select a user to view tasks.
              </p>
            ) : (
              <>
                <div className="task-toolbar">
                  <div className="task-filters">
                    {(
                      [
                        "all",
                        "active",
                        "completed"
                      ] as TaskFilter[]
                    ).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        aria-pressed={
                          taskFilter === filter
                        }
                        onClick={() =>
                          setTaskFilter(filter)
                        }
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="language-field">
                    <label htmlFor="task-language">
                      Language
                    </label>

                    <select
                      id="task-language"
                      value={language}
                      onChange={(event) =>
                        setLanguage(
                          event.target.value as TaskLanguage
                        )
                      }
                    >
                      <option value="original">
                        Original
                      </option>
                      <option value="en">
                        English
                      </option>
                      <option value="sv">
                        Svenska
                      </option>
                    </select>
                  </div>
                </div>

                <p>
                  Showing {visibleTodos.length} of{" "}
                  {selectedTodos.length} tasks
                </p>

                {translationLoading && (
                  <p role="status">
                    Translating task titles...
                  </p>
                )}

                {translationError && (
                  <p role="alert">
                    {translationError}
                  </p>
                )}

                <TodoList
                  todos={visibleTodos}
                  categories={categories}
                  weather={weather}
                  onToggle={toggleTodo}
                  onCategoryChange={changeCategory}
                  translations={translations}
                />
              </>
            )}
          </section>
        </div>

        <aside
          className="weather-sidebar"
          aria-label="Weather information"
        >
          <div className="weather-panel">
            <form
              className="city-search"
              onSubmit={searchCity}
            >
              <label htmlFor="city-search">
                Search worldwide weather
              </label>

              <div className="city-search-controls">
                <input
                  id="city-search"
                  type="search"
                  value={cityInput}
                  onChange={(event) =>
                    setCityInput(event.target.value)
                  }
                  placeholder="City, e.g. Tokyo"
                  required
                />

                <button type="submit">
                  Search
                </button>
              </div>
            </form>

            {weatherLoading ? (
              <p>Loading weather...</p>
            ) : weatherError ? (
              <p role="alert">{weatherError}</p>
            ) : weather ? (
              <WeatherDashboard weather={weather} />
            ) : (
              <p>No weather available.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
