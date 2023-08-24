import React, { useState, useMemo } from "react";
import styles from "./ConversationsList.module.css";
import ConversationBox from "./ConversationBox";
import { Conversation } from "../../../types/database";
import ConversationBoxSkeleton from "../../skeletons/BoxSkeleton";
import getConversationName from "../../../utils/getConversationName";
import Searchbar from "../../ui/Searchbar";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
}

function ConversationsList({
  conversations: initialConversations,
  isLoading,
}: ConversationListProps) {
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
    .map((item, index) => <ConversationBoxSkeleton key={index} />);

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
}

export default React.memo(ConversationsList);
