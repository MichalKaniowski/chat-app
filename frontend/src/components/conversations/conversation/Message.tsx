import { Message as MessageType, Token, User } from "../../../types/database";
import styles from "./Message.module.css";
import jwtDecode from "jwt-decode";
import { useFileModalContext } from "../../../hooks/context/useFileModalContext";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const { onFileChange } = useFileModalContext();

  const token = sessionStorage.getItem("token") as string;
  const { id } = jwtDecode(token) as Token;

  const author = message?.authorId as User;
  const authorId = author._id;
  const isPersonAnAuthor = id === authorId;

  return (
    <li key={message?._id} className={styles.message}>
      <div
        className={styles["message-content"]}
        style={{
          [isPersonAnAuthor ? "right" : "left"]: "0",
          flexDirection: isPersonAnAuthor ? "row-reverse" : "row",
        }}
      >
        <img
          src={message?.image}
          className={styles["message-avatar"]}
          alt="User avatar"
        />
        <div>
          <p className={styles["message-author"]} style={{}}>
            {author?.username}
          </p>
          <div
            className={styles["message-background"]}
            style={{
              backgroundColor: isPersonAnAuthor ? "#0084ff" : "#E4E6EB",
              color: isPersonAnAuthor ? "white" : "black",
            }}
          >
            {message?.isBodyAnImage ? (
              <img
                src={message?.body}
                className={styles["message-body-image"]}
                onClick={() => onFileChange(message.body)}
              />
            ) : (
              <p className={styles["message-body"]}>{message?.body}</p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
