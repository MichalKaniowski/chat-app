import { useState, useEffect } from "react";
import axios from "axios";

export default function Conversations() {
  const [conversations, setConversations] = useState<any>();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    async function getConversations() {
      const res = await axios.get("http://localhost:3000/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const conversations = await res.data;
      setConversations(conversations);
    }

    getConversations();
  }, [token]);

  return <div>conversations</div>;
}
