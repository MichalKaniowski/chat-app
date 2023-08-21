import styles from "./ConversationsList.module.css";
import ConversationBox from "./ConversationBox";
import { Conversation } from "../../../types/database";
import ConversationBoxSkeleton from "../../skeletons/BoxSkeleton";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
}

export default function ConversationsList({
  conversations,
  isLoading,
}: ConversationListProps) {
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
        <input className={styles.searchbar} placeholder="Search in messenger" />
        <ul>{isLoading ? skeletonContent : conversationsContent}</ul>
      </div>
      <hr />
    </div>
  );
}
