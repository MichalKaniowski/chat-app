import styles from "./ConversationFooter.module.css";
import { Conversation, Message, Token, User } from "../../../types/database";
import { preview } from "../../../types/conversation";
import { FileWithPath } from "react-dropzone";
import { useRef, useState } from "react";
import { socket } from "../../../utils/socket";
import toast from "react-hot-toast";
import jwtDecode from "jwt-decode";
import { BsImages } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import createMessage from "../../../helpers/db/createMessage";

interface ConversationFooterProps {
  preview: preview;
  acceptedFiles: FileWithPath[];
  conversation: Conversation;
  getInputProps: <T extends object>() => T;
  onPreviewChange: (preview: preview) => void;
  onMessageAdd: (message: Message) => void;
}

export default function ConversationFooter({
  preview,
  acceptedFiles,
  conversation,
  getInputProps,
  onPreviewChange,
  onMessageAdd,
}: ConversationFooterProps) {
  const [isSending, setIsSending] = useState(false);

  const messageRef = useRef<HTMLInputElement | null>(null);

  const users = conversation?.userIds as User[];
  const token = sessionStorage.getItem("token") as string;
  const { email } = jwtDecode(token) as Token;

  const isPreviewImage = preview?.toString().includes("image");
  const isPreviewVideo = preview?.toString().includes("video");

  async function messageCreateHandler(e: React.FormEvent) {
    e.preventDefault();

    const author = users.find((user: User) => user.email === email)!;
    const image = author.image || "/images/person-placeholder.png";
    const authorId = author._id;
    const conversationId = conversation._id;
    const body = messageRef?.current?.value.trim() ?? "";

    const newMessage = {
      body,
      authorId,
      conversationId,
      image,
    };

    const formData = new FormData();
    formData.append("newMessage", JSON.stringify(newMessage));

    if (acceptedFiles.length > 0) {
      acceptedFiles.forEach((file) => formData.append("file", file));
    }

    if (!body && acceptedFiles.length === 0) {
      return toast.error("Your message is empty");
    }

    if (body.length > 600) {
      return toast.error("Your message is too long");
    }

    // adding fake message (optimistic update)
    onMessageAdd({
      _id: "fake-message",
      ...newMessage,
      fileUrls: Array(acceptedFiles.length).fill(
        "/images/image-placeholder.png"
      ),
      seenIds: [],
    });
    setIsSending(true);

    const message = (await createMessage(formData)) as Message;
    if (!message) return;

    onMessageAdd(message);
    socket.emit("send-message", {
      message: message,
      room: conversation._id,
    });

    setIsSending(false);
    if (messageRef?.current) {
      messageRef.current.value = "";
    }
    onPreviewChange(null);
  }

  return (
    <div className={styles.footer}>
      <hr />
      <form onSubmit={messageCreateHandler} className={styles["message-form"]}>
        <label htmlFor="file-input" className={styles["custom-file-upload"]}>
          <BsImages size={28} />
        </label>
        <input
          id="file-input"
          type="file"
          multiple={true}
          accept=".jpg, .jpeg, .png, .mp4, .webm"
          className={styles["message-form-button"]}
          disabled={isSending}
          {...getInputProps()}
        />
        {preview && isPreviewImage && (
          <img src={preview.toString()} className={styles["file-preview"]} />
        )}
        {preview && isPreviewVideo && (
          <video src={preview.toString()} className={styles["file-preview"]} />
        )}
        <input
          ref={messageRef}
          placeholder="Send a message"
          className={styles["message-input"]}
          disabled={isSending}
        />
        <button className={styles["message-form-button"]}>
          <IoMdSend size={28} />
        </button>
      </form>
    </div>
  );
}
