import { Message as MessageType, Token, User } from "../../../types/database";
import styles from "./Message.module.css";
import jwtDecode from "jwt-decode";
import { useFileModalContext } from "../../../hooks/context/useFileModalContext";

interface MessageProps {
  message: MessageType;
}

interface FilesProps {
  fileUrls: string[] | undefined;
}

const Files = ({ fileUrls }: FilesProps) => {
  const { onFileChange } = useFileModalContext();

  const imageExtensions = ["jpg", "jpeg", "png"];
  const videoExtensions = ["mp4", "webm"];

  if (!fileUrls || fileUrls.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 5,
        alignItems: "center",
      }}
    >
      {fileUrls.map((fileUrl) => {
        const fileExtension = fileUrl.split(".").at(-1) as string;

        if (imageExtensions.includes(fileExtension)) {
          return (
            <img
              key={fileUrl}
              src={fileUrl}
              className={styles["message-body-image"]}
              onClick={() => onFileChange(fileUrl)}
            />
          );
        } else if (videoExtensions.includes(fileExtension)) {
          return (
            <video
              key={fileUrl}
              src={fileUrl}
              className={styles["message-body-image"]}
              onClick={() => onFileChange(fileUrl)}
            />
          );
        }
      })}
    </div>
  );
};

export default function Message({ message }: MessageProps) {
  const token = sessionStorage.getItem("token") as string;
  const { id } = jwtDecode(token) as Token;

  const author = message?.authorId as User;
  const authorId = author._id || author;
  const isPersonAnAuthor = id === authorId;
  const fileUrls = message.fileUrls;

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
            {message?.body && (
              <p className={styles["message-body"]}>{message?.body}</p>
            )}
            {message?.fileUrls && <Files fileUrls={fileUrls} />}
          </div>
        </div>
      </div>
    </li>
  );
}
