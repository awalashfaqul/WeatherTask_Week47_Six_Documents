# WeatherTask — Monday → Tuesday → Wednesday

These are **three snapshots of ONE project**, not three projects students must maintain. Begin in Monday; on Tuesday add/replace the changed files; on Wednesday add/replace the changed files again. Each snapshot is runnable independently so teachers can inspect the expected result.

## Start

```bash
cd Monday
npm install
npm run dev
```

Open the localhost URL printed by Vite. The project is React + TypeScript + Vite.

## Monday: build the foundation

1. `src/types/User.ts`: `User` defines `id`, `name`, `email`.
2. `src/types/Todo.ts`: `Todo.userId` connects tasks to users; `completed` is boolean.
3. `src/types/Weather.ts`: UI-friendly shape, even though Monday uses sample values.
4. `src/data/mockData.ts`: predictable practice data, not live API data.
5. `src/components/UserSelector.tsx`: controlled dropdown. `onSelectUser` is a callback **prop**. `event` is supplied by React; `event.target.value` is the HTML select's string value; `Number` converts to the numeric user ID.
6. `src/components/TodoItem.tsx`: displays a task; ternary changes completed/pending text.
7. `src/components/TodoList.tsx`: `map()` turns each Todo into one component; `key` identifies list elements.
8. `src/components/WeatherDashboard.tsx`: renders weather passed through props, without knowing where it came from.
9. `src/App.tsx`: `useState<number | null>(null)` means selected ID starts empty. `filter()` creates the list for the selected user. Props connect App to children.
10. `src/main.tsx`: mounts `<App />` into the real DOM node `<div id="root">` in `index.html`. React updates the DOM from JSX and state.

**Monday expected result:** user dropdown with Sara and Leo; Sara has two tasks, Leo has one; sample Stockholm weather; no-selection message before choosing a user.

## Tuesday: connect JSONPlaceholder

Only **three files change/add** compared with Monday:

- NEW `src/services/userApi.ts`: `getUsers(): Promise<User[]>` fetches the users endpoint. There is no parameter because the endpoint is fixed. `await fetch()` waits for HTTP response; `response.ok` checks success; `await response.json()` parses JSON.
- NEW `src/services/todoApi.ts`: same pattern for tasks.
- REPLACE `src/App.tsx`: keeps the same components, but replaces `mockUsers` and `mockTodos` with `users` and `todos` state. `useEffect(..., [])` starts requests on mount. Each service has its own loading and error state. Cleanup ignores responses after the effect becomes inactive.

**Tuesday expected result:** real fictional JSONPlaceholder users and todos; changing user filters tasks; completed/pending labels; user and task failures handled separately. Weather still labelled sample data.

## Wednesday: integrate WeatherAPI.com

Only **three files change/add** compared with Tuesday:

- NEW `.env.example`: copy to `.env.local`, replace placeholder with your own WeatherAPI key. Restart Vite after changes.
- NEW `src/services/weatherApi.ts`: `getWeather(city: string): Promise<Weather>` accepts city **parameter**. Calling `getWeather("London")` passes the **argument** "London". `q` is the location query. `mapWeather()` reads `data.location.name`, `data.current.temp_c`, `data.current.condition.text`, `.code`, `.icon`, `data.current.wind_kph`, `data.current.precip_mm` and returns the simplified Weather object. The `icon` field may start with `//`, so prefix `https:`.
- REPLACE `src/App.tsx`: add `city`, `weather`, `weatherLoading`, `weatherError` state; a controlled city select; and `useEffect(..., [city])` to request new weather whenever city changes. Cleanup uses `active` to ignore stale responses. Existing user/task requests remain independent.

**Wednesday expected result:** changing Stockholm to London triggers a new request; real weather is shown with °C, km/h and mm; weather failures do not hide tasks. Weather condition code 1009 is **Overcast**. Grouping it as Cloudy belongs to Thursday's business rules, not Wednesday.

## General syntax rules

- `function name(parameter: Type): ReturnType { return result; }`: a **parameter** is defined in the function; an **argument** is passed when calling it.
- `const fn = (x: number) => x * 2`: arrow function; concise for callbacks. A normal function declaration is useful for named operations. Arrow functions do not have their own `this`.
- `data.current.condition.text`: each dot accesses a property **inside the previous object**. The path must match the JSON tree.
- `const [value, setValue] = useState(initial)`: state value + setter. The setter triggers React rendering.
- `useEffect(() => { /* external sync */ }, [city])`: callback runs on mount and when `city` changes; the dependency list is not a function argument supplied by a user.
- `async function getWeather(city: string): Promise<Weather>`: returns a Promise that eventually resolves to Weather. `await` unwraps that result within async code.
- `return data` sends a value to a caller; `console.log(data)` prints to DevTools; JSX such as `<p>{data.city}</p>` makes it visible on the page. React manages the actual DOM.

## Security and limitations

Never publish a real WeatherAPI key in slides, repositories or student handouts. `.env.local` is gitignored, but `VITE_` variables are visible in a browser bundle. A production app needs a backend proxy for secrets. JSONPlaceholder records are fictional and writes are not reliably persistent. Type assertions of JSON are not runtime validation; add validation for production systems.
