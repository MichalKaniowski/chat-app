import UsersList from "../components/users/UsersList";
import { User, Token } from "../types/database";
import jwtDecode from "jwt-decode";
import axios from "axios";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import getAuthorizationHeader from "../utils/getAuthorizationHeader";
import Navigation from "../components/navigation/Navigation";

export default function UsersPage() {
  const token = sessionStorage.getItem("token") as string;
  const decodedToken: Token = jwtDecode(token);

  const { isLoading, data: users } = useQuery(["users"], getUsers, {
    cacheTime: 30 * 60 * 1000, // 30 minutes
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  async function getUsers() {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: getAuthorizationHeader() },
      });

      const users: User[] = response.data.filter(
        (user: User) => user.email !== decodedToken.email
      );

      return users;
    } catch (error) {
      toast.error("Something went wrong while getting users.");
    }
  }

  return (
    <Navigation>
      <UsersList users={users!} isLoading={isLoading} />
      <EmptyState />
    </Navigation>
  );
}
