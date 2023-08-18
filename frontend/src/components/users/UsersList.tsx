import styles from "./UsersList.module.css";
import UserBox from "./UserBox";
import { User } from "../../types/database";

export default function UsersList({ users }: { users: User[] }) {
  return (
    <div className={styles["users-list"]}>
      <h2 className={styles.heading}>Users</h2>
      <input className={styles.searchbar} placeholder="Search in messenger" />
      <ul>
        {users.map((user: User) => (
          <UserBox key={user._id} user={user} />
        ))}
      </ul>
    </div>
  );
}
