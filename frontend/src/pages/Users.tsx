import UsersList from "../components/users/UsersList";
import { useEffect, useState } from "react";
import { User, Token } from "../types/database";
import jwt_decode from "jwt-decode";
import axios from "axios";
import DesktopSidebar from "../components/navigation/DesktopSidebar";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

export default function UsersPage() {
  // const [users, setUsers] = useState<User[]>([]);

  const token = sessionStorage.getItem("token") as string;
  const decodedToken: Token = jwt_decode(token);

  const {
    isLoading,
    data: users,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    cacheTime: Infinity, // 1hr
    staleTime: Infinity,
  });

  async function getUsers() {
    try {
      console.log("calling function");
      const response = await axios.get("http://localhost:3000/users");

      const users: User[] = response.data;

      return users;
    } catch (error) {
      toast.error("Something went wrong while getting users.");
    }
  }

  // useEffect(() => {
  //   async function getUsers() {
  //     try {
  //       const response = await axios.get("http://localhost:3000/users");

  //       const people: User[] = response.data;

  //       setUsers(people?.filter((user) => user.email !== decodedToken.email));
  //     } catch (error) {
  //       toast.error("Something went wrong while getting users.");
  //     }
  //   }

  //   getUsers();
  // }, [decodedToken?.email]);

  return (
    <DesktopSidebar>
      <UsersList users={users!} isLoading={isLoading} />
      <EmptyState />
    </DesktopSidebar>
  );
}
