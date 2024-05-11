import { BsFillChatDotsFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import useConversationContext from "../../hooks/context/useConversationContext";

export default function ConversationsLink() {
  // in case a conversation was entered earlier, we will redirect the user right to the conversation
  // instead of redirecting to /conversations and user seeing the loading state
  const { lastConversationId } = useConversationContext();
  const conversationUrl = "/conversations/" + lastConversationId;

  return (
    <Link to={conversationUrl}>
      <BsFillChatDotsFill size={24} style={{ color: "#000" }} />
    </Link>
  );
}
