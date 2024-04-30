import jwtDecode from "jwt-decode";
import { Token } from "../types/database";

export default function getSession() {
  try {
    const token = sessionStorage.getItem("token") as string;
    const refreshToken = sessionStorage.getItem("refreshToken") as string;
    const decodedToken = jwtDecode(token) as Token;

    return { token, refreshToken, decodedToken };
  } catch (error) {
    return { token: "", refreshToken: "", decodedToken: {} };
  }
}
