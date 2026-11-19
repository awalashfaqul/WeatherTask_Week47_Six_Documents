import type User from "../types/User";

export async function getUsers(): Promise<User[]> {
  
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
  
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const userData = (await response.json()) as User[];
  return userData;
};