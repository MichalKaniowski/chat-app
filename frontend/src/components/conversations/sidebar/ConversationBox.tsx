import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ConversationBox.module.css";
import { Conversation, Token, User } from "../../../types/database";
import toast from "react-hot-toast";
import jwtDecode from "jwt-decode";

export default function ConversationBox({
  conversation,
}: {
  conversation: Conversation;
}) {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token") as string;
  const { id } = jwtDecode(token) as Token;
  const refreshToken = sessionStorage.getItem("refreshToken") as string;

  const users = conversation.userIds as User[];

  const conversationName = conversation.isGroup
    ? conversation.name
    : users.find((user) => user._id !== id)?.username;

  async function getConversationHandler(conversationId: string) {
    try {
      const res = await axios.get(
        `http://localhost:3000/conversations/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}, Basic ${refreshToken}` } }
      );

      const conversation = await res.data;

      navigate(`/conversations/${conversation?._id}`, {
        state: conversation,
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
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
        <h3 className={styles.name}>{conversationName}</h3>
        <p>Last message</p>
      </div>
    </div>
  );
}
