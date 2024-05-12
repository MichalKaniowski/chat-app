import axios from "axios";

export default async function deleteUser(refreshToken?: string) {
  const token = refreshToken
    ? refreshToken
    : sessionStorage.getItem("refreshToken");

  await axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/users/logout?refreshToken=${token}`
  );
}
