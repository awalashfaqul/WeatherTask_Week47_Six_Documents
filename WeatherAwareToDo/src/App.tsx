
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

export default function App() {
  // USER STATE
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  // TODO STATE
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [todosError, setTodosError] = useState("");

  // WEATHER STATE
  const [city, setCity] = useState("Stockholm");
  const [weather, setWeather] =
    useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] =
    useState(false);
  const [weatherError, setWeatherError] = useState("");

  // USER API
  useEffect(() => { // Load users on mount
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
    return () => { active = false; };
  }, []);

  // TODO API
  useEffect(() => { // Load todos on mount
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
    return () => { active = false; };
  }, []);

  // WEATHER API — RELOAD WHEN CITY CHANGES
  // Load weather whenever the city changes
  useEffect(() => {
    let active = true;

    async function loadWeather() {
      setWeatherLoading(true);
      setWeatherError("");
      setWeather(null);

      try {
        const result = await getWeather(city);

        if (active) {
          setWeather(result);
        }
      } catch (error) {
        console.error("Weather API failed:", error);

        if (active) {
            setWeatherError(
              error instanceof Error
              ? error.message
              : "Unknown weather error"
            );
      }
      } finally {
        if (active) {
          setWeatherLoading(false);
        }
      }
    }

    void loadWeather();

    return () => { // Cleanup on unmount or city change
      active = false;
    };
  }, [city]);

  const selectedTodos = todos.filter(
    (todo) => todo.userId === selectedUserId
  );

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
            onSelectUser={setSelectedUserId}
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
          <p>Please select a user to view tasks.</p>
        ) : (
          <TodoList todos={selectedTodos} />
        )}
      </section>

      <section>
        <h2>Current Weather</h2>

        <label htmlFor="city">Select location:</label>

        <select
          id="city"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
          }}
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
    </main>
  );
}
