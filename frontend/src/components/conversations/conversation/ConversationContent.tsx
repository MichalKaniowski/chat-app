import { useState, useEffect, useRef, useContext, useCallback } from "react";
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
import { socket } from "../../../utils/socket";
import { useDropzone } from "react-dropzone";

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
  const [preview, setPreview] = useState<ArrayBuffer | string | null>();

  const onDrop = useCallback((acceptedFiles: FileList) => {
    const file = new FileReader();

    file.readAsDataURL(acceptedFiles[0]);

    file.onload = () => {
      // todo: think about what if file is video, how to make preview then
      setPreview(file.result);
    };
  }, []);

  const { onConversationOpenStateChange } = useContext(ConversationsContext);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop });
  console.log(acceptedFiles);

  const messageRef = useRef<HTMLInputElement>(null!);

  // useEffect(() => {
  //   const imageInput = document.getElementById(
  //     "file-input"
  //   ) as HTMLInputElement;

  //   function imageChangeHandler() {
  //     const file = imageInput.files![0];
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       const imgUrl = e.target?.result as string;
  //       setUploadedImage(imgUrl);
  //     };
  //     reader.readAsDataURL(file);
  //   }

  //   // todo: why setting event listener and not just adding onChange to input??
  //   imageInput?.addEventListener("change", imageChangeHandler);

  //   return () => {
  //     imageInput.removeEventListener("change", imageChangeHandler);
  //   };
  // }, []);

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
        `${import.meta.env.VITE_API_BASE_URL}/conversations/${
          conversation._id
        }/seen`,
        {},
        { headers: { Authorization: getAuthorizationHeader() } }
      );
    }

    updateSeenInConversation();
  }, [conversation.messageIds, conversation._id]);

  useEffect(() => {
    onConversationOpenStateChange(true);
  }, [onConversationOpenStateChange]);

  const token = sessionStorage.getItem("token") as string;
  const { id, email } = jwtDecode(token) as Token;

  const users = conversation?.userIds as User[];
  const messages = conversation?.messageIds as MessageType[];
  const conversationName = getConversationName(conversation);
  const imgSrc = conversation?.image || "/images/person-placeholder.png";

  async function messageCreateHandler(e: React.FormEvent) {
    e.preventDefault();

    // todo: change document.getElemenetById to ref and add ref to image input
    // const imageInput = document.getElementById(
    //   "file-input"
    // ) as HTMLInputElement;

    if (acceptedFiles.length > 0) {
      // todo: remove trycatch and extract code in this if statement to another function
      try {
        //   const newMessage = {
        //     body: content,
        //     isBodyAnImage: true,
        //     image: image,
        //     authorId: author._id,
        //     conversationId: conversation._id,
        //   };

        const author = users.find((user: User) => user.email === email)!;
        const image = author.image || "/images/person-placeholder.png";

        const formData = new FormData();
        acceptedFiles.forEach((file) => formData.append("file", file));
        const newMessage = {
          authorId: author._id,
          image,
          conversationId: conversation._id,
        };
        formData.append("newMessage", JSON.stringify(newMessage));
        // imageInput.value = "";

        // adding fake message, so there is no loading after sending a message
        // once real message is created this message will be removed
        // onMessageAdd({
        //   _id: "fake-message",
        //   ...newMessage,
        //   seenIds: [],
        // });
        setIsSending(true);

        const res = await axios.post(
          "http://localhost:3000/messages",
          formData,
          {
            headers: {
              Authorization: getAuthorizationHeader(),
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("RESPONSE: ", res);
        // const res = await axios.post(
        //   `${import.meta.env.VITE_API_BASE_URL}/messages`,
        //   newMessage,
        //   {
        //     headers: {
        //       Authorization: getAuthorizationHeader(),
        //     },
        //   }
        // );

        //todo: what is we will get error as res here, will we setIsSending to false??

        setIsSending(false);
        // const message = await res.data;
        // socket.emit("send-message", {
        //   message: message,
        //   room: conversation._id,
        // });
        // onMessageAdd(message);
        // setUploadedImage("");
      } catch (error) {
        toast.error("Something went wrong");
      }
    } else {
      // todo: remove trycatch and extract code in this if statement to another function
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
          `${import.meta.env.VITE_API_BASE_URL}/messages`,
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
        socket.emit("send-message", {
          message: message,
          room: conversation._id,
        });
        onMessageAdd(message);
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      }
    }
  }

  return (
    <div className={styles.conversation}>
      <div className={styles.header}>
        <div
          className={styles["header-content"]}
          style={{ backgroundColor: isDragActive ? "red" : "white" }}
        >
          {!isScreenBig && (
            <Link
              to="/conversations"
              onClick={() => onConversationOpenStateChange(false)}
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

      <div
        {...getRootProps()}
        onClick={() => {}}
        style={{ height: "calc(100% - 72px)" }}
      >
        {messages?.length > 0 ? (
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
            <label
              htmlFor="file-input"
              className={styles["custom-file-upload"]}
            >
              <BsImages size={28} />
            </label>
            {/* <input
            id="file-input"
            type="file"
            accept=".jpg, .jpeg, .png, .mp4, .webm"
            className={styles["message-form-button"]}
            disabled={isSending}
          /> */}
            <input
              id="file-input"
              type="file"
              multiple={true}
              accept=".jpg, .jpeg, .png, .mp4, .webm"
              className={styles["message-form-button"]}
              disabled={isSending}
              {...getInputProps()}
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
    </div>
  );
}
