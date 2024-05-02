import axios from "axios";
import getAuthorizationHeader from "../utils/getAuthorizationHeader";

export default async function updateSeen(conversationId: string) {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/conversations/${conversationId}/seen`,
    {},
    { headers: { Authorization: getAuthorizationHeader() } }
  );

  return res;
}
