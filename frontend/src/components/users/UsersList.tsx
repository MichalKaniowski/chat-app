import React from "react";
import styles from "./UsersList.module.css";
import UserBox from "./UserBox";
import { User } from "../../types/database";

interface UsersListProps {
  users: User[];
  isLoading: boolean;
}

const UsersList = React.memo(({ users }: UsersListProps) => {
  console.log("userslist run", users);
  return (
    <div className={styles["users-list"]}>
      <h2 className={styles.heading}>Users</h2>
      <input className={styles.searchbar} placeholder="Search in messenger" />
      <ul>
        {users?.map((user: User) => (
          <UserBox key={user._id} user={user} />
        ))}
      </ul>
    </div>
  );
});

export default UsersList;
