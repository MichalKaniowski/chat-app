import Skeleton from "react-loading-skeleton";
import styles from "./ConversationSkeleton.module.css";
import MessageSkeleton from "./MessageSkeleton";

export default function ConversationSkeleton() {
  return (
    <div className={styles.conversation}>
      {/* header */}
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <Skeleton circle width={50} height={50} />
          <div className={styles["conversation-info"]}>
            <h2 className={styles["conversation-name"]}>
              <Skeleton />
            </h2>
            <p className={styles["user-active"]}>
              <Skeleton />
            </p>
          </div>
        </div>
        <hr />
      </div>

      {/* body */}
      <div className={styles.body}>
        <ul className={styles.messages}>
          <MessageSkeleton isAuthor={false} />
          <MessageSkeleton isAuthor={true} />
          <MessageSkeleton isAuthor={false} />
          <MessageSkeleton isAuthor={false} />
          <MessageSkeleton isAuthor={true} />
          <MessageSkeleton isAuthor={true} />
          <MessageSkeleton isAuthor={false} />
        </ul>
      </div>

      {/* footer */}
      <div className={styles.footer}>
        <hr />
        <form className={styles["message-form"]}>
          <p>
            <Skeleton className={styles["message-input"]} />
          </p>
          <Skeleton circle style={{ width: "34px", height: "34px" }} />
        </form>
      </div>
    </div>
  );
}
