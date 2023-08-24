import { Conversation, Message as MessageType } from "../../../types/database";
import ConversationSkeleton from "../../skeletons/ConversationSkeleton";
import ConversationContent from "./ConversationContent";

interface ConversationProps {
  conversation: Conversation;
  isLoading: boolean;
  isScreenBig: boolean;
  onMessageAdd: (message: MessageType) => void;
}

export default function ConversationComponent({
  conversation,
  isLoading,
  isScreenBig,
  onMessageAdd,
}: ConversationProps) {
  if (!conversation) return null;

  const content = isLoading ? (
    <ConversationSkeleton />
  ) : (
    <ConversationContent
      conversation={conversation}
      isScreenBig={isScreenBig}
      onMessageAdd={onMessageAdd}
    />
  );

  return content;
}
