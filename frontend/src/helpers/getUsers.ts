import toast from "react-hot-toast";
import getAuthorizationHeader from "../utils/getAuthorizationHeader";
import axios from "axios";

export default async function getUsers() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`, {
      headers: { Authorization: getAuthorizationHeader() },
    });

    const users = res?.data;

    if (!users) {
      toast.error("Something went wrong while getting users");
      return { users: [] };
    }

    return { users };
  } catch (error) {
    toast.error("Something went wrong while getting users");
    return { users: [] };
  }
}
