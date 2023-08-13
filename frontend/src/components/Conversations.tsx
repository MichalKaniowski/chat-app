import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/logoutUser";

export default function Conversations() {
  const [conversations, setConversations] = useState([]);

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const refreshToken = sessionStorage.getItem("refreshToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }

    async function getConversations() {
      const res = await axios.get("http://localhost:3000/conversations", {
        headers: {
          Authorization: `Bearer ${token}, Basic ${refreshToken}`,
        },
      });

      const data = await res.data;
      const newAccessToken = data?.token;

      if (newAccessToken) {
        sessionStorage.setItem("token", newAccessToken);
      }

      const conversations = data.conversations;
      setConversations(conversations);
    }

    getConversations();
  }, [token, refreshToken, navigate]);

  return (
    <div>
      <button onClick={() => logoutUser(navigate)}>
        This button will logout the user.
      </button>
      conversations
    </div>
  );
}
