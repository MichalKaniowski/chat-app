import axios from "axios";
import toast from "react-hot-toast";
import getAuthorizationHeader from "../../../utils/getAuthorizationHeader";

export const getLastConversationIdForUser = async () => {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/conversations/getLastConversationForUser`,
      {
        headers: {
          Authorization: getAuthorizationHeader(),
        },
      }
    );

    const data = await res.data;
    const conversationId = data?.conversationId;

    if (!conversationId) {
      toast.error("Something went wrong while getting conversation.");
      return { conversationId: null };
    }

    return { conversationId };
  } catch (error) {
    toast.error("Something went wrong while getting conversation.");
    return { conversationId: null };
  }
};
