import { useState } from "react";
import styles from "./Input.module.css";

interface InputProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  onValueChange: (value: string) => void;
  validate: (value: string) => boolean;
}

export default function Input({
  id,
  label,
  type,
  placeholder,
  onValueChange,
  validate,
}: InputProps) {
  const [value, setValue] = useState("");
  const [hasTouched, setHasTouched] = useState(false);

  const isValid = value.trim().length > 0 && validate(value);

  const isInvalid = hasTouched && !isValid;

  function valueChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    onValueChange(e.target.value);
  }

  return (
    <div className={styles["input-container"]}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={valueChangeHandler}
        onBlur={() => setHasTouched(true)}
        placeholder={placeholder}
        style={{ backgroundColor: isInvalid ? "#E5A29F" : "inherit" }}
        type={type ? type : "text"}
      />
      {isInvalid && <p style={{ color: "red" }}>Incorrect {label}</p>}
    </div>
  );
}
