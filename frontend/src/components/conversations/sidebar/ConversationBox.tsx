import { useNavigate } from "react-router-dom";
import styles from "./ConversationBox.module.css";
import { Conversation, Token, Message, User } from "../../../types/database";
import toast from "react-hot-toast";
import getConversationName from "../../../utils/getConversationName";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { socket } from "../../../utils/socket";
import useConversationContext from "../../../hooks/context/useConversationContext";

export default function ConversationBox({
  conversation,
}: {
  conversation: Conversation;
}) {
  const navigate = useNavigate();
  const { onLastConversationSet } = useConversationContext();

  useEffect(() => {
    if (conversation?._id) {
      socket.emit("join-room", conversation._id);
    }
  }, [conversation._id]);

  const token = sessionStorage.getItem("token") as string;
  const { id } = jwtDecode(token) as Token;

  const lastMessage = (conversation?.messageIds as Message[])?.at(
    -1
  ) as Message;

  const lastMessageBody =
    lastMessage?.fileUrls && lastMessage.fileUrls?.length > 0
      ? "file"
      : lastMessage?.body;
  const isAuthor = lastMessage?.authorId === id;

  const user = (conversation.userIds as User[]).find((user) => user._id === id);
  const hasSeen = user?.seenMessageIds.includes(lastMessage?._id) || isAuthor;

  const conversationName = getConversationName(conversation);

  async function getConversationHandler(conversationId: string) {
    try {
      navigate(`/conversations/${conversationId}`);
      onLastConversationSet(conversationId);
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
        <p
          style={{
            color: hasSeen ? "grey" : "black",
            fontWeight: hasSeen ? 400 : 600,
          }}
        >
          {isAuthor ? "You: " : ""} {lastMessageBody}
        </p>
      </div>
    </div>
  );
}
``;
