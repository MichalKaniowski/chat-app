import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/database";
import styles from "./UserBox.module.css";
import getAuthorizationHeader from "../../utils/getAuthorizationHeader";

export default function UserBox({ user }: { user: User }) {
  const navigate = useNavigate();

  async function conversationCreateHandler() {
    navigate(`/conversations/loading-state`, {
      state: { message: "loading" },
    });

    const conversation = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/conversations`,
      { id: user._id },
      {
        headers: {
          Authorization: getAuthorizationHeader(),
        },
      }
    );

    // data passed to navigate must be serialized
    const serializedConversation = {
      ...conversation.data,
      _id: conversation.data._id.toString(),
    };

    navigate(`/conversations/${serializedConversation?._id}`, {
      state: serializedConversation,
    });
  }

  return (
    <div className={styles["user-box"]} onClick={conversationCreateHandler}>
      <div>
        <img
          className={styles["user-img"]}
          src="/images/person-placeholder.png"
        />
      </div>
      <div>
        <h3 className={styles.username}>{user.username}</h3>
        <p>Last message</p>
      </div>
    </div>
  );
}
