import styles from "./EmptyState.module.css";

export default function EmptyState() {
  return (
    <div className={styles["empty-state"]}>
      <h1>Join a conversation or create a new one.</h1>
    </div>
  );
}
