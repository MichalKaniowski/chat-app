import { Message as MessageType, Token, User } from "../../../types/database";
import styles from "./Message.module.css";
import jwtDecode from "jwt-decode";

export default function Message({ message }: { message: MessageType }) {
  const token = sessionStorage.getItem("token") as string;
  const { email } = jwtDecode(token) as Token;
  const author = message?.authorId as User;
  const isPersonAnAuthor = email === author?.email;

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
                style={{ width: "100px", height: "100px" }}
              />
            ) : (
              // <p></p>
              <p className={styles["message-body"]}>{message?.body}</p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
