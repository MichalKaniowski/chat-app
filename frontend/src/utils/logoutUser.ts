import axios from "axios";

export async function logoutUser() {
  const refreshToken = sessionStorage.getItem("refreshToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  await axios.delete(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/users/logout?refreshToken=${refreshToken}`
  );
}
