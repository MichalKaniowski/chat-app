import jwtDecode from "jwt-decode";
import { Token, User } from "../types/database";

export default function getIsActive(users: User[]) {
  // in case user ids were passed
  if (typeof users[0] === "string") {
    return false;
  }

  const token = sessionStorage.getItem("token") as string;
  const { id } = jwtDecode(token) as Token;
  const isActive = !!users.find((user) => user._id !== id)?.active;

  return isActive;
}
