import styles from "./MobileFooter.module.css";
import { BsFillPeopleFill } from "react-icons/bs";
import { CgLogOut } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../utils/logoutUser";
import ConversationsLink from "./ConversationsLink";

export default function MobileFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();

  // we are not checking for screen size, because footer won't be displayed on larger screens anyway
  const displayFooter =
    pathname.includes("users") ||
    pathname === "/conversations" ||
    pathname === "/conversations/";

  return (
    <div className={styles.container}>
      <div
        style={{
          height: displayFooter ? "calc(100% - 50px)" : "100%",
        }}
      >
        {children}
      </div>
      <div className={styles.footer}>
        <Link to="/users">
          <BsFillPeopleFill size={28} style={{ color: "#000" }} />
        </Link>
        <ConversationsLink />
        <Link to="/" onClick={logoutUser}>
          <CgLogOut size={28} style={{ color: "#000" }} />
        </Link>
      </div>
    </div>
  );
}
