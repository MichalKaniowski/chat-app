import UsersList from "../components/users/UsersList";
import { useEffect, useState } from "react";
import { User, Token } from "../types/database";
import jwt_decode from "jwt-decode";
import axios from "axios";
import DesktopSidebar from "../components/navigation/DesktopSidebar";
import EmptyState from "../components/EmptyState";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const token = sessionStorage.getItem("token") as string;
  const decodedToken: Token = jwt_decode(token);

  useEffect(() => {
    async function getUsers() {
      const response = await axios.get("http://localhost:3000/users");

      const people: User[] = response.data;

      setUsers(people?.filter((user) => user.email !== decodedToken.email));
    }

    getUsers();
  }, [decodedToken?.email]);

  return (
    <DesktopSidebar>
      <UsersList users={users} />
      <EmptyState />
    </DesktopSidebar>
  );
}
