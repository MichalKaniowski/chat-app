import styles from "./ConversationsList.module.css";
import ConversationBox from "./ConversationBox";
import { Conversation } from "../../../types/database";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
}

export default function ConversationsList({
  conversations,
  isLoading,
}: ConversationListProps) {
  return (
    <div className={styles["conversations-list"]}>
      {isLoading ? (
        <div>loading</div>
      ) : (
        <div>
          <h2 className={styles.heading}>Conversations</h2>
          <input
            className={styles.searchbar}
            placeholder="Search in messenger"
          />
          <ul>
            {conversations.map((conversation: Conversation) => (
              <ConversationBox
                key={conversation._id}
                conversation={conversation}
              />
            ))}
          </ul>
        </div>
      )}
      <hr />
    </div>
  );
}
