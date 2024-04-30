import styles from "./ConversationHeader.module.css";
import { useContext } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import ConversationsContext from "../../../store/ConversationsProvider";

interface ConversationHeaderProps {
  isScreenBig: boolean; //todo: check where isScreenBig is used, and is it needed to be prop-drilled
  imgSrc: string;
  conversationName: string;
}

export default function ConversationHeader({
  isScreenBig,
  imgSrc,
  conversationName,
}: ConversationHeaderProps) {
  const { onConversationOpenStateChange } = useContext(ConversationsContext);

  return (
    <div>
      <div className={styles["header-content"]}>
        {!isScreenBig && (
          <Link
            to="/conversations"
            onClick={() => onConversationOpenStateChange(false)}
          >
            <AiOutlineArrowLeft
              size={24}
              className={styles["back-arrow-mobile"]}
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
  );
}
