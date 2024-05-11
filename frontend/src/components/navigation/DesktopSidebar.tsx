import { Link } from "react-router-dom";
import styles from "./DesktopSidebar.module.css";
import { BsFillPeopleFill } from "react-icons/bs";
import { CgLogOut } from "react-icons/cg";
import { logoutUser } from "../../utils/logoutUser";
import ConversationsLink from "./ConversationsLink";

export default function DesktopSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles["desktop-sidebar"]}>
      <div className={styles["sidebar-content"]}>
        <nav className={styles.navbar}>
          <Link to="/users">
            <BsFillPeopleFill size={24} style={{ color: "#000" }} />
          </Link>
          <ConversationsLink />
          <Link to="/" onClick={logoutUser}>
            <CgLogOut size={24} style={{ color: "#000" }} />
          </Link>
        </nav>
        <hr className={styles.hr} />
      </div>
      <div className={styles["children-container"]}>{children}</div>
    </div>
  );
}
