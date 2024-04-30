import styles from "./ConversationMessages.module.css";
import { Message as MessageType, Token, User } from "../../../types/database";
import Message from "./Message";
import jwtDecode from "jwt-decode";

interface ConversationMessagesProps {
  messages: MessageType[];
}

function EmptyConversationMessages() {
  return (
    <div className={styles["empty-conversation"]}>
      No messages exchanged with this user.
    </div>
  );
}

function Messages({ messages }: ConversationMessagesProps) {
  const token = sessionStorage.getItem("token") as string;
  const { id } = jwtDecode(token) as Token;

  return (
    <div className={styles.body}>
      <ul className={styles.messages}>
        {messages?.map((message: MessageType, index) => {
          const author = message.authorId as User;

          const seenByPeopleString = (message.seenIds as User[])
            .filter((user: User) => user._id !== id)
            .filter((user) => user._id !== author._id)
            .map((user) => user.username)
            .join(", ");

          if (index === messages.length - 1) {
            const isAuthor = author._id === id;

            return (
              <div key={message._id}>
                <Message key={message._id} message={message} />
                {seenByPeopleString && (
                  <p
                    className={styles["seen-by-text"]}
                    style={{
                      textAlign: isAuthor ? "end" : "start",
                      [isAuthor ? "marginRight" : "marginLeft"]: "10px",
                    }}
                  >
                    Seen by {seenByPeopleString}
                  </p>
                )}
              </div>
            );
          }

          return <Message key={message._id} message={message} />;
        })}
        <div id="scroll-to"></div>
      </ul>
    </div>
  );
}

export default function ConversationMessages({
  messages,
}: ConversationMessagesProps) {
  return messages?.length > 0 ? (
    <Messages messages={messages} />
  ) : (
    <EmptyConversationMessages />
  );
}
