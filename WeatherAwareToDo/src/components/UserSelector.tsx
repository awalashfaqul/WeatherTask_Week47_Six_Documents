
import type User from "../types/User";

type Props = {
  users: User[];
  selectedUserId: number | null;
  onSelectUser: (id: number | null) => void;
};

export default function UserSelector({
  users,
  selectedUserId,
  onSelectUser
}: Props) {
  return (
    <div>
      <label htmlFor="user">Select a user:</label>

      <select
        id="user"
        value={selectedUserId ?? ""}
        onChange={(event) => {
          const value = event.target.value;

          onSelectUser(
            value === "" ? null : Number(value)
          );
        }}
      >
        <option value="">Choose a user</option>

        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}
