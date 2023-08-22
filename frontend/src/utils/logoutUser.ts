import { useNavigate } from "react-router-dom";
import axios from "axios";

export async function logoutUser() {
  const navigate = useNavigate();

  const refreshToken = sessionStorage.getItem("refreshToken");
  if (!refreshToken) {
    navigate("/");
  }
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  await axios.delete(
    `http://localhost:3000/users/logout?refreshToken=${refreshToken}`
  );
}
