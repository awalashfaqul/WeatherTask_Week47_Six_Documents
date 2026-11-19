import type User from '../types/User';
import type Todo from '../types/Todo';
import type Weather from '../types/Weather';

export const mockUsers: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    { id: 4, name: 'David', email: 'david@example.com' }
]

export const mockTodos: Todo[] = [
    { userId: 1, id: 1, title: 'Buy groceries', completed: false },
    { userId: 2, id: 2, title: 'Walk the dog', completed: true },
    { userId: 3, id: 3, title: 'Buy groceries', completed: false },
    { userId: 4, id: 4, title: 'Clean the house', completed: true },
    { userId: 1, id: 5, title: 'Go cycling', completed: false }
]

export const mockWeather: Weather = {
  city: "Stockholm",
  temperature: 3,
  condition: "Overcast",
  code: 1009,
  icon: "",
  windSpeed: 13.3,
  humidity: 70,
  precipitation: 0.01
};