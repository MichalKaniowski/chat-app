import styles from "./MessageSkeleton.module.css";
import Skeleton from "react-loading-skeleton";

export default function MessageSkeleton({ isAuthor }: { isAuthor?: boolean }) {
  return (
    <li className={styles.message}>
      <div
        className={styles["message-content"]}
        style={{
          position: "absolute",
          [isAuthor ? "right" : "left"]: "0",
          flexDirection: isAuthor ? "row-reverse" : "row",
        }}
      >
        <Skeleton
          circle
          width={50}
          height={50}
          style={{ margin: isAuthor ? "0 0 0 5px" : "0 5px 0 0" }}
        />
        <div className={styles["message-info"]}>
          <p className={styles["message-author"]}>
            <Skeleton style={{ marginLeft: isAuthor ? "120px" : "0" }} />
          </p>
          <Skeleton />
        </div>
      </div>
    </li>
  );
}
