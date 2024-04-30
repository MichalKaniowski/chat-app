import React from "react";
import { Conversation, Message as MessageType } from "../../../types/database";
import ConversationSkeleton from "../../skeletons/ConversationSkeleton";
import ConversationContent from "./ConversationContent";

interface ConversationProps {
  conversation: Conversation;
  isLoading: boolean;
  isScreenBig: boolean;
  onMessageAdd: (message: MessageType) => void;
}

function _ConversationComponent({
  conversation,
  isLoading,
  isScreenBig,
  onMessageAdd,
}: ConversationProps) {
  if (!conversation) return null;

  return isLoading ? (
    <ConversationSkeleton />
  ) : (
    <ConversationContent
      conversation={conversation}
      isScreenBig={isScreenBig}
      onMessageAdd={onMessageAdd}
    />
  );
}

const ConversationComponent = React.memo(_ConversationComponent);
export default ConversationComponent;
