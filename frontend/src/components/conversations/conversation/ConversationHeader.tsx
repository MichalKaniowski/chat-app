import styles from "./ConversationHeader.module.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import useIsScreenBig from "../../../hooks/context/useIsScreenBig";

interface ConversationHeaderProps {
  imgSrc: string;
  conversationName: string;
}

export default function ConversationHeader({
  imgSrc,
  conversationName,
}: ConversationHeaderProps) {
  const { isScreenBig } = useIsScreenBig();

  return (
    <div>
      <div className={styles["header-content"]}>
        {!isScreenBig && (
          <Link to="/conversations">
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
