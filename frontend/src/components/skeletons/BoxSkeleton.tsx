import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./BoxSkeleton.module.css";

export default function BoxSkeleton() {
  return (
    <div className={styles.box}>
      <div className={styles["left-column"]}>
        <Skeleton circle width={50} height={50} />
      </div>
      <div className={styles["right-column"]}>
        <h2>
          <Skeleton />
        </h2>
        <p>
          <Skeleton />
        </p>
      </div>
    </div>
  );
}
