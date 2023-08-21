import React, { useState, useMemo } from "react";
import styles from "./UsersList.module.css";
import UserBox from "./UserBox";
import { User } from "../../types/database";
import UserBoxSkeleton from "../skeletons/BoxSkeleton";
import Searchbar from "../ui/Searchbar";

interface UsersListProps {
  users: User[];
  isLoading: boolean;
}

const UsersList = React.memo(
  ({ users: initialUsers, isLoading }: UsersListProps) => {
    const [searchValue, setSearchValue] = useState("");

    const users = useMemo(() => {
      return initialUsers?.filter((user) =>
        user.username.includes(searchValue.trim())
      );
    }, [initialUsers, searchValue]);

    const usersContent = users?.map((user: User) => (
      <UserBox key={user._id} user={user} />
    ));

    const skeletonContent = Array(8)
      .fill(0)
      .map((item, index) => <UserBoxSkeleton key={index} />);

    return (
      <div className={styles["users-list"]}>
        <div className={styles["users-list-content"]}>
          <h2 className={styles.heading}>Users</h2>
          {/* <input className={styles.searchbar} placeholder="Search in messenger" /> */}
          <Searchbar onChange={(value: string) => setSearchValue(value)} />
          <ul className={styles.list}>
            {isLoading ? skeletonContent : usersContent}
          </ul>
        </div>
        <hr />
      </div>
    );
  }
);

export default UsersList;
