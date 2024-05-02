import styles from "./ConversationContent.module.css";
import { useState, useEffect, useContext, useCallback } from "react";
import { Conversation, Message as MessageType } from "../../../types/database";
import getConversationName from "../../../utils/getConversationName";
import ConversationsContext from "../../../store/ConversationsProvider";
import { useDropzone, FileWithPath } from "react-dropzone";
import ConversationHeader from "./ConversationHeader";
import { preview } from "../../../types/conversation";
import ConversationMessages from "./ConversationMessages";
import ConversationFooter from "./ConversationFooter";
import toast from "react-hot-toast";
import updateSeen from "../../../helpers/updateSeen";

interface ConversationContentProps {
  conversation: Conversation;
  isScreenBig: boolean;
  onMessageAdd: (message: MessageType) => void;
}

export default function ConversationContent({
  conversation,
  isScreenBig,
  onMessageAdd,
}: ConversationContentProps) {
  const [preview, setPreview] = useState<preview>(null);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = new FileReader();

    file.readAsDataURL(acceptedFiles[0]);

    file.onload = () => {
      setPreview(file.result);
    };
  }, []);

  const { onConversationOpenStateChange } = useContext(ConversationsContext);
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    maxSize: 25 * 1024 * 1024,
    maxFiles: 5,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
    },
  });

  useEffect(() => {
    if (fileRejections.length > 0) {
      const fileRejectionMessages = fileRejections.map(
        (rejection) => rejection.errors[0].code
      );
      if (fileRejectionMessages.includes("file-invalid-type")) {
        toast.error("Unsupported file type");
      } else {
        toast.error("Something went wrong");
      }
    }
  }, [fileRejections]);

  useEffect(() => {
    document.querySelector("#scroll-to")?.scrollIntoView();

    async function updateSeenInConversation() {
      if (!conversation?._id) return;

      if (
        (conversation.messageIds as MessageType[]).find(
          (message) => message._id === "fake-message"
        )
      ) {
        return;
      }

      await updateSeen(conversation._id);
    }

    updateSeenInConversation();
  }, [conversation.messageIds, conversation._id]);

  useEffect(() => {
    onConversationOpenStateChange(true);
  }, [onConversationOpenStateChange]);

  const messages = conversation?.messageIds as MessageType[];
  const conversationName = getConversationName(conversation);
  const imgSrc = conversation?.image || "/images/person-placeholder.png";

  return (
    <div className={styles.conversation}>
      <ConversationHeader
        isScreenBig={isScreenBig}
        imgSrc={imgSrc}
        conversationName={conversationName}
      />

      <div
        {...getRootProps()}
        onClick={() => {}}
        className={styles["conversation-content"]}
      >
        {isDragActive && (
          <div className={styles["file-drag-overlay"]}>
            <p className={styles["file-drag-overlay-text"]}>
              Upuść pliki tutaj
            </p>
          </div>
        )}

        <ConversationMessages messages={messages} />

        <ConversationFooter
          preview={preview}
          acceptedFiles={acceptedFiles}
          conversation={conversation}
          getInputProps={getInputProps}
          onPreviewChange={(preview: preview) => setPreview(preview)}
          onMessageAdd={onMessageAdd}
        />
      </div>
    </div>
  );
}
