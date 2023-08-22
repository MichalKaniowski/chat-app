import styles from "./EmptyState.module.css";
import { Balancer } from "react-wrap-balancer";

export default function EmptyState() {
  return (
    <div className={styles["empty-state"]}>
      <div className={styles["empty-state-container"]}>
        <Balancer>
          <h1>Join a conversation or create a new one.</h1>
        </Balancer>
      </div>
    </div>
  );
}
