import axios from "axios";
import getAuthorizationHeader from "../../../utils/getAuthorizationHeader";
import toast from "react-hot-toast";

export default async function createConversation(userId: string) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/conversations`,
      { id: userId },
      {
        headers: {
          Authorization: getAuthorizationHeader(),
        },
      }
    );
    const conversation = res.data;

    return conversation;
  } catch (error) {
    toast.error("Something went wrong while creating conversation.");
    return null;
  }
}
