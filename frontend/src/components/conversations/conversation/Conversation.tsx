import { useRef } from "react";
import styles from "./Conversation.module.css";
import { IoMdSend } from "react-icons/io";
import jwt_decode from "jwt-decode";
import { Token, Conversation, User, Message } from "../../../types/database";
import axios from "axios";
import toast from "react-hot-toast";

interface ConversationProps {
  conversation: Conversation;
  onMessageAdd: (messageId: Message) => void;
}

export default function ConversationComponent({
  conversation,
  onMessageAdd,
}: ConversationProps) {
  const imgSrc = conversation?.image || "/images/person-placeholder.png";

  const token = sessionStorage.getItem("token") as string;
  const { id, email } = jwt_decode(token) as Token;
  const refreshToken = sessionStorage.getItem("refreshToken") as string;
  const messageRef = useRef<HTMLInputElement>(null!);

  const users = conversation?.userIds as User[];
  const messages = conversation?.messageIds as Message[];

  async function messageCreateHandler(e: React.FormEvent) {
    e.preventDefault();
    try {
      const author = users.find((user: User) => user.email === email)!;

      const body = messageRef.current.value;
      const image = author.image || "/images/person-placeholder.png";
      const authorId = author._id;
      const conversationId = conversation._id;

      const res = await axios.post(
        "http://localhost:3000/messages",
        {
          body,
          image,
          authorId,
          conversationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}, Basic ${refreshToken}`,
          },
        }
      );

      const message = await res.data;
      onMessageAdd(message);

      messageRef.current.value = "";

      toast.success("Succesfully sent a message");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className={styles.conversation}>
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <img src={imgSrc} className={styles["conversation-img"]} />
          <div>
            <h3>{conversation?.name}</h3>
            <p>Active</p>
          </div>
        </div>
        <hr />
      </div>

      {messages?.length > 0 ? (
        <div className={styles.body}>
          <ul className={styles.messages}>
            {messages.map((message: Message, index: number) => {
              const author = message.authorId as User;
              const isPersonAnAuthor = id === author._id;

              return (
                <li
                  key={message._id}
                  className={styles.message}
                  style={{ marginTop: index === 0 ? "10px" : "0" }}
                >
                  <div
                    className={styles["message-content"]}
                    style={{
                      [isPersonAnAuthor ? "right" : "left"]: "0",
                      flexDirection: isPersonAnAuthor ? "row-reverse" : "row",
                    }}
                  >
                    <img
                      src={message.image}
                      className={styles["message-avatar"]}
                      alt="User avatar"
                    />
                    <div>
                      <p className={styles["message-author"]}>
                        {author.username}
                      </p>
                      <div
                        className={styles["message-background"]}
                        style={{
                          backgroundColor: isPersonAnAuthor
                            ? "#0084ff"
                            : "#E4E6EB",
                          color: isPersonAnAuthor ? "white" : "black",
                        }}
                      >
                        <p className={styles["message-content"]}>
                          {message.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className={styles["empty-conversation"]}>
          No messages exchanged with this user.
        </div>
      )}

      <div className={styles.footer}>
        <hr />
        <form
          onSubmit={messageCreateHandler}
          className={styles["message-form"]}
        >
          <input
            ref={messageRef}
            placeholder="Send a message"
            className={styles["message-input"]}
          />
          <button className={styles["send-message"]}>
            <IoMdSend size={28} />
          </button>
        </form>
      </div>
    </div>
  );
}
