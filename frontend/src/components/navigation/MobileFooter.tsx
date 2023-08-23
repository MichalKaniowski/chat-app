import styles from "./MobileFooter.module.css";
import { BsFillPeopleFill, BsFillChatDotsFill } from "react-icons/bs";
import { CgLogOut } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../utils/logoutUser";
import { useContext } from "react";
import ConversationsContext from "../../store/ConversationsProvider";

export default function MobileFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConversationOpen } = useContext(ConversationsContext);
  const { pathname } = useLocation();

  const displayFooter = pathname.includes("users") || !isConversationOpen;

  return (
    <div className={styles.container}>
      <div
        style={{
          height: displayFooter ? "calc(100% - 50px)" : "100%",
        }}
      >
        {children}
      </div>
      {!isConversationOpen && (
        <div className={styles.footer}>
          <Link to="/users">
            <BsFillPeopleFill size={28} style={{ color: "#000" }} />
          </Link>
          <Link to="/conversations">
            <BsFillChatDotsFill size={28} style={{ color: "#000" }} />
          </Link>
          <Link to="/" onClick={logoutUser}>
            <CgLogOut size={28} style={{ color: "#000" }} />
          </Link>
        </div>
      )}
    </div>
  );
}
