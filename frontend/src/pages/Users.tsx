import { useEffect } from "react";
import UsersList from "../components/users/UsersList";
import { User, Token } from "../types/database";
import jwtDecode from "jwt-decode";
import axios from "axios";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import getAuthorizationHeader from "../utils/getAuthorizationHeader";
import Navigation from "../components/navigation/Navigation";
import { socket } from "../utils/socket";

export default function UsersPage() {
  const token = sessionStorage.getItem("token") as string;
  const { id, email }: Token = jwtDecode(token);

  const {
    isLoading,
    data: users,
    refetch: refetchUsers,
  } = useQuery(["users"], getUsers, {
    staleTime: 30 * 1000, // 30 seconds
  });

  // todo: make sockets code working
  useEffect(() => {
    // todo: check if instead of these 3 event listeners you can't do one useEffect which will run if navigator.onLine changes
    window.addEventListener("load", async (event) => {
      const isOnline = navigator.onLine ? "online" : "offline";

      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/users/update-online-status`,
        { id, isOnline }
      );
    });

    window.addEventListener("offline", async (event) => {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/users/update-online-status`,
        { id, isOnline: false }
      );
    });

    window.addEventListener("online", async (event) => {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/users/update-online-status`,
        { id, isOnline: true }
      );
    });

    //TODO: check if you have to refetch users or maybe you can add this new user to list of users, the same situation you had in some other component
    socket.on("user-connected-received", (userId: string) => {
      refetchUsers();
    });
  }, []);

  async function getUsers() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        {
          headers: { Authorization: getAuthorizationHeader() },
        }
      );

      const users: User[] = response.data.filter(
        (user: User) => user.email !== email
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
