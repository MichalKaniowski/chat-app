import styles from "./EmptyState.module.css";
import { Balancer } from "react-wrap-balancer";

export default function EmptyState() {
  return (
    <div className={styles["empty-state"]}>
      <div className={styles["empty-state-container"]}>
        <h1>
          <Balancer>Join a conversation or create a new one.</Balancer>
        </h1>
      </div>
    </div>
  );
}
