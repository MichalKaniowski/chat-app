import axios from "axios";
import getAuthorizationHeader from "../../../utils/getAuthorizationHeader";
import toast from "react-hot-toast";

export default async function getConversations() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/conversations`,
      {
        headers: {
          Authorization: getAuthorizationHeader(),
        },
      }
    );

    const data = await res.data;
    const newAccessToken = data?.token;

    if (newAccessToken) {
      sessionStorage.setItem("token", newAccessToken);
    }

    const conversations = data?.conversations;

    // empty array won't be caught here and that's what we want
    if (!conversations) {
      toast.error("Something went wrong while fetching conversations.");
      return { conversations };
    }

    return { conversations };
  } catch (error) {
    toast.error("Something went wrong while getting conversations.");
    return { conversations: [] };
  }
}
