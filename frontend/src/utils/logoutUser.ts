import axios from "axios";

export async function logoutUser() {
  const refreshToken = sessionStorage.getItem("refreshToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  await axios.delete(
    `http://localhost:3000/users/logout?refreshToken=${refreshToken}`
  );
}
