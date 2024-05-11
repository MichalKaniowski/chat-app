import React, { useEffect } from "react";
import { Conversation, Message as MessageType } from "../../../types/database";
import ConversationSkeleton from "../../skeletons/ConversationSkeleton";
import ConversationContent from "./ConversationContent";
import useConversationContext from "../../../hooks/context/useConversationContext";

interface ConversationProps {
  conversation?: Conversation | null;
  isLoading: boolean;
  onMessageAdd?: (message: MessageType) => void;
}

function _ConversationComponent({
  conversation,
  isLoading,
  onMessageAdd,
}: ConversationProps) {
  const { onLastConversationSet } = useConversationContext();

  // mostly we will have all things passed or only isLoading passed in case we want loading state
  // to be shown for smooth route transistions, but in case some prop would not be passed
  // we are checking if every prop is present
  const displaySkeleton = isLoading || !conversation || !onMessageAdd;

  useEffect(() => {
    onLastConversationSet(conversation?._id || "");
  }, [conversation?._id, onLastConversationSet]);

  return displaySkeleton ? (
    <ConversationSkeleton />
  ) : (
    <ConversationContent
      conversation={conversation}
      onMessageAdd={onMessageAdd}
    />
  );
}

const ConversationComponent = React.memo(_ConversationComponent);
export default ConversationComponent;
