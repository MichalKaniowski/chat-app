import styles from "./Searchbar.module.css";

interface SearchbarProps {
  onChange: (value: string) => void;
}

export default function Searchbar({ onChange }: SearchbarProps) {
  return (
    <input
      className={styles.searchbar}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search in messenger"
    />
  );
}
