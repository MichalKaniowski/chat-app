import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ConversationBox.module.css";
import { Conversation } from "../../../types/database";

export default function ConversationBox({
  conversation,
}: {
  conversation: Conversation;
}) {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token") as string;
  const refreshToken = sessionStorage.getItem("refreshToken") as string;

  async function getConversationHandler(conversationId: string) {
    const res = await axios.get(
      `http://localhost:3000/conversations/${conversationId}`,
      { headers: { Authorization: `Bearer ${token}, Basic ${refreshToken}` } }
    );

    const conversation = await res.data;

    navigate(`/conversations/${conversation?._id}`, {
      state: conversation,
    });
  }

  return (
    <div
      className={styles["conversation-box"]}
      onClick={() => getConversationHandler(conversation._id)}
    >
      <div>
        <img
          className={styles["conversation-img"]}
          src="/images/person-placeholder.png"
        />
      </div>
      <div>
        <h3 className={styles.name}>{conversation.name}</h3>
        <p>Last message</p>
      </div>
    </div>
  );
}
