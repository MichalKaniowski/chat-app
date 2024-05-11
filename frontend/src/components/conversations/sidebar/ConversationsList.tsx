import styles from "./ConversationsList.module.css";
import React, { useState, useMemo } from "react";

import ConversationBox from "./ConversationBox";
import ConversationBoxSkeleton from "../../skeletons/BoxSkeleton";
import getConversationName from "../../../utils/getConversationName";
import Searchbar from "../../ui/Searchbar";

import { Conversation } from "../../../types/database";

interface ConversationListProps {
  conversations?: Conversation[];
  isLoading: boolean;
}

const ConversationsList = ({
  conversations: initialConversations = [],
  isLoading,
}: ConversationListProps) => {
  const [searchValue, setSearchValue] = useState("");

  const conversations = useMemo(() => {
    return initialConversations?.filter((conv) => {
      const conversationName = getConversationName(conv);
      return conversationName.includes(searchValue.trim());
    });
  }, [initialConversations, searchValue]);

  const conversationsContent = conversations?.map(
    (conversation: Conversation) => (
      <ConversationBox key={conversation._id} conversation={conversation} />
    )
  );

  const skeletonContent = Array(8)
    .fill(0)
    .map((_, index) => <ConversationBoxSkeleton key={index} />);

  return (
    <div className={styles["conversations-list"]}>
      <div className={styles["conversations-list-content"]}>
        <h2 className={styles.heading}>Conversations</h2>
        <Searchbar onChange={(value: string) => setSearchValue(value)} />
        <ul>{isLoading ? skeletonContent : conversationsContent}</ul>
      </div>
      <hr />
    </div>
  );
};

const ConversationsListComponent = React.memo(ConversationsList);
export default ConversationsListComponent;
