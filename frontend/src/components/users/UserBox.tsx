import { useNavigate } from "react-router-dom";
import { User } from "../../types/database";
import styles from "./UserBox.module.css";
import { socket } from "../../utils/socket";
import createConversation from "../../helpers/createConversation";

export default function UserBox({ user }: { user: User }) {
  const navigate = useNavigate();

  async function conversationCreateHandler() {
    navigate(`/conversations/loading-state`, {
      state: { message: "loading" },
    });

    const conversation = await createConversation(user._id);
    if (!conversation) return;

    socket.emit("join-room", conversation._id);
    socket.emit("create-conversation", conversation);

    // data passed to navigate must be serialized
    const serializedConversation = {
      ...conversation,
      _id: conversation._id.toString(),
    };

    navigate(`/conversations/${serializedConversation?._id}`, {
      state: serializedConversation,
    });
  }

  return (
    <div className={styles["user-box"]} onClick={conversationCreateHandler}>
      {user.active === true && <p>online</p>}
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
