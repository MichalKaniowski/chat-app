import { useEffect } from "react";
import UsersList from "../components/users/UsersList";
import { User, Token } from "../types/database";
import jwtDecode from "jwt-decode";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/navigation/Navigation";
import { socket } from "../utils/socket";
import fetchUsers from "../helpers/getUsers";
import updateOnlineStatus from "../helpers/updateOnlineStatus";
import { useQueryClient } from "react-query";

export default function UsersPage() {
  const token = sessionStorage.getItem("token") as string;
  const { id, email }: Token = jwtDecode(token);

  const queryClient = useQueryClient();
  const { isLoading, data: users } = useQuery(["users"], getUsers, {
    staleTime: 30 * 1000, // 30 seconds
  });

  useEffect(() => {
    // todo: check if instead of these 3 event listeners you can't do one useEffect which will run if navigator.onLine changes
    window.addEventListener("load", async () => {
      const isOnline = navigator.onLine;

      updateOnlineStatus(id, isOnline);
    });

    window.addEventListener("offline", async () => {
      updateOnlineStatus(id, false);
    });

    window.addEventListener("online", async () => {
      updateOnlineStatus(id, true);

      socket.on("user-connected-received", (userId: string) => {
        queryClient.setQueryData(["users"], (prevUsers: User[] | undefined) =>
          (prevUsers ?? []).map((user) =>
            user._id === userId ? { ...user, active: true } : user
          )
        );
      });
    });
  }, [id, queryClient]);

  async function getUsers() {
    try {
      const { users } = await fetchUsers();

      const filteredUsers: User[] = users.filter(
        (user: User) => user.email !== email
      );

      return filteredUsers;
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
