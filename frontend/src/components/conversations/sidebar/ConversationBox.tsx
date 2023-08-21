import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ConversationBox.module.css";
import { Conversation } from "../../../types/database";
import toast from "react-hot-toast";
import getConversationName from "../../../utils/getConversationName";
import getAuthorizationHeader from "../../../utils/getAuthorizationHeader";

export default function ConversationBox({
  conversation,
}: {
  conversation: Conversation;
}) {
  const navigate = useNavigate();

  const conversationName = getConversationName(conversation);

  async function getConversationHandler(conversationId: string) {
    try {
      navigate(`/conversations/${conversationId}`, {
        state: { message: "loading" },
      });

      const res = await axios.get(
        `http://localhost:3000/conversations/${conversationId}`,
        { headers: { Authorization: getAuthorizationHeader() } }
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
