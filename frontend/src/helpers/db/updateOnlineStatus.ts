import axios from "axios";

export default async function updateOnlineStatus(
  id: string,
  isOnline: boolean
) {
  await axios.patch(
    `${import.meta.env.VITE_API_BASE_URL}/users/update-online-status`,
    { id, isOnline }
  );
}
