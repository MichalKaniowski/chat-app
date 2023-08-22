import { useEffect, useRef } from "react";
import styles from "./Conversation.module.css";
import { IoMdSend } from "react-icons/io";
import jwtDecode from "jwt-decode";
import { Token, Conversation, User, Message } from "../../../types/database";
import axios from "axios";
import toast from "react-hot-toast";
import ConversationSkeleton from "../../skeletons/ConversationSkeleton";
import getConversationName from "../../../utils/getConversationName";
import getAuthorizationHeader from "../../../utils/getAuthorizationHeader";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";

interface ConversationProps {
  conversation: Conversation;
  isLoading: boolean;
  isScreenBig: boolean;
  onMessageAdd: (messageId: Message) => void;
  onConversationStateChange?: (stage: boolean) => void;
}

export default function ConversationComponent({
  conversation,
  isLoading,
  isScreenBig,
  onMessageAdd,
  onConversationStateChange,
}: ConversationProps) {
  const imgSrc = conversation?.image || "/images/person-placeholder.png";

  const token = sessionStorage.getItem("token") as string;
  const { id, email } = jwtDecode(token) as Token;
  const messageRef = useRef<HTMLInputElement>(null!);

  const users = conversation?.userIds as User[];
  const messages = conversation?.messageIds as Message[];

  const conversationName = getConversationName(conversation);

  if (onConversationStateChange) {
    onConversationStateChange(true);
  }

  useEffect(() => {
    document.querySelector("#scroll-to")?.scrollIntoView();
  }, [conversation]);

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
            Authorization: getAuthorizationHeader(),
          },
        }
      );

      const message = await res.data;
      onMessageAdd(message);

      messageRef.current.value = "";
    } catch {
      toast.error("Something went wrong");
    }
  }

  if (!conversation) return null;

  const content = isLoading ? (
    <ConversationSkeleton />
  ) : (
    <div className={styles.conversation}>
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          {!isScreenBig && (
            <Link
              to="/conversations"
              onClick={() =>
                onConversationStateChange && onConversationStateChange(false)
              }
            >
              <AiOutlineArrowLeft
                size={24}
                style={{ color: "rgb(0, 132, 255)" }}
              />
            </Link>
          )}
          <img src={imgSrc} className={styles["conversation-img"]} />
          <div>
            <h3 className={styles["conversation-name"]}>{conversationName}</h3>
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
                        <p>{message.body}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
            <div id="scroll-to"></div>
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

  return content;
}
