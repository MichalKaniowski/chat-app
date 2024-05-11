import axios from "axios";
import getAuthorizationHeader from "../../../utils/getAuthorizationHeader";
import toast from "react-hot-toast";
import { Conversation } from "../../../types/database";

export default async function getConversation(conversationId: string) {
  try {
    if (conversationId === "") return { conversation: null };

    const res = await axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/conversations/conversation/${conversationId}`,
      { headers: { Authorization: getAuthorizationHeader() } }
    );
    const conversation = (await res?.data) as Conversation | null;

    if (!conversation) {
      toast.error("Something went wrong while getting the conversation.");
      return { conversation: null };
    }

    return { conversation };
  } catch (error) {
    toast.error("Something went wrong while getting the conversation.");
    return { conversation: null };
  }
}
