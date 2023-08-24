import { useState, useEffect, useRef, useContext } from "react";
import {
  Conversation,
  Token,
  Message as MessageType,
  User,
} from "../../../types/database";
import styles from "./ConversationsContent.module.css";
import getConversationName from "../../../utils/getConversationName";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import { IoMdSend } from "react-icons/io";
import { AiOutlineArrowLeft } from "react-icons/ai";
import ConversationsContext from "../../../store/ConversationsProvider";
import { BsImages } from "react-icons/bs";
import toast from "react-hot-toast";
import getAuthorizationHeader from "../../../utils/getAuthorizationHeader";
import axios from "axios";
import Message from "./Message";

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
  const [isSending, setIsSending] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");

  useEffect(() => {
    const imageInput = document.getElementById(
      "image-input"
    ) as HTMLInputElement;

    function imageChangeHandler() {
      const file = imageInput.files![0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setUploadedImage(imgUrl);
      };
      reader.readAsDataURL(file);
    }

    imageInput?.addEventListener("change", imageChangeHandler);

    return () => {
      imageInput.removeEventListener("change", imageChangeHandler);
    };
  }, []);

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

      await axios.post(
        `http://localhost:3000/conversations/${conversation._id}/seen`,
        {},
        { headers: { Authorization: getAuthorizationHeader() } }
      );
    }

    updateSeenInConversation();
  }, [conversation.messageIds]);

  const conversationContext = useContext(ConversationsContext);
  conversationContext.onConversationStateChange(true);
  const imgSrc = conversation?.image || "/images/person-placeholder.png";

  const token = sessionStorage.getItem("token") as string;
  const { email } = jwtDecode(token) as Token;
  const messageRef = useRef<HTMLInputElement>(null!);

  const users = conversation?.userIds as User[];
  const messages = conversation?.messageIds as MessageType[];

  const conversationName = getConversationName(conversation);

  async function messageCreateHandler(e: React.FormEvent) {
    e.preventDefault();

    const imageInput = document.getElementById(
      "image-input"
    ) as HTMLInputElement;
    if (imageInput.files!.length > 0) {
      try {
        const file = imageInput.files![0];
        const reader = new FileReader();

        const sizeInKb = Number((file.size / 1024).toFixed(2));

        if (sizeInKb > 500) {
          toast.error("File is too large");
          return;
        }

        reader.onload = async function (e: any) {
          const content = e.target.result;

          const author = users.find((user: User) => user.email === email)!;
          const image = author.image || "/images/person-placeholder.png";

          // adding fake message, so there is no loading after sending a message
          // once real message is created this message will be removed
          imageInput.value = "";
          onMessageAdd({
            _id: "fake-message",
            body: content,
            isBodyAnImage: true,
            image: image,
            authorId: author,
            conversationId: conversation._id,
            seenIds: [],
          });
          setIsSending(true);

          const res = await axios.post(
            "http://localhost:3000/messages",
            {
              body: content,
              isBodyAnImage: true,
              image: image,
              authorId: author._id,
              conversationId: conversation._id,
            },
            {
              headers: {
                Authorization: getAuthorizationHeader(),
              },
            }
          );

          setIsSending(false);
          const message = await res.data;
          onMessageAdd(message);
          setUploadedImage("");
        };

        reader.readAsDataURL(file);
      } catch (error) {
        toast.error("Something went wrong");
      }
    } else {
      try {
        const author = users.find((user: User) => user.email === email)!;

        const body = messageRef.current.value.trim();
        const image = author.image || "/images/person-placeholder.png";
        const authorId = author._id;
        const conversationId = conversation._id;

        if (!body) {
          toast.error("Message is empty");
          return;
        }

        if (body.length > 600) {
          toast.error("Message is too long");
          return;
        }

        // adding fake message, so there is no loading after sending a message
        // once real message is created this message will be removed
        onMessageAdd({
          _id: "fake-message",
          body,
          isBodyAnImage: false,
          image,
          authorId: author,
          conversationId,
          seenIds: [],
        });
        messageRef.current.value = "";

        setIsSending(true);
        const res = await axios.post(
          "http://localhost:3000/messages",
          {
            body,
            isBodyAnImage: false,
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

        setIsSending(false);
        const message = await res.data;
        onMessageAdd(message);
      } catch {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div className={styles.conversation}>
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          {!isScreenBig && (
            <Link
              to="/conversations"
              onClick={() =>
                conversationContext.onConversationStateChange(false)
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
            {messages?.map((message: MessageType) => {
              return <Message key={message._id} message={message} />;
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
          <label htmlFor="image-input" className={styles["custom-file-upload"]}>
            <BsImages size={28} />
          </label>
          <input
            id="image-input"
            type="file"
            accept=".jpg, .jpeg, .png"
            className={styles["message-form-button"]}
            disabled={isSending}
          />
          {uploadedImage && (
            <img
              src={uploadedImage}
              style={{ width: "40px", height: "40px" }}
            />
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
    </div>
  );
}
