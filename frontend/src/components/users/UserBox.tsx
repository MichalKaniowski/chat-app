import { useNavigate } from "react-router-dom";
import { User } from "../../types/database";
import styles from "./UserBox.module.css";
import { socket } from "../../utils/socket";
import createConversation from "../../helpers/db/conversation/createConversation";
import OnlineStatus from "../OnlineStatus";

export default function UserBox({ user }: { user: User }) {
  const navigate = useNavigate();

  async function conversationCreateHandler() {
    // we are navigating to /conversations to show loading state on desktops (on mobile it will be conversations list) while creating a conversation
    // without it user would wait some time before being redirected to specific conversation url
    navigate("/conversations");

    // if conversation already exists, a new one won't be created
    const conversation = await createConversation(user._id);
    if (!conversation) return;

    const id = conversation._id.toString();

    socket.emit("join-room", id);
    socket.emit("create-conversation", conversation);

    navigate(`/conversations/${id}`);
  }

  return (
    <div className={styles["user-box"]} onClick={conversationCreateHandler}>
      <div className={styles["user-img-container"]}>
        <img
          className={styles["user-img"]}
          src="/images/person-placeholder.png"
        />
        {user.active === true && <OnlineStatus />}
      </div>
      <div>
        <h3 className={styles.username}>{user.username}</h3>
        <p>Last message</p>
      </div>
    </div>
  );
}
