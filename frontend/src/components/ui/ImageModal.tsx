import { useFileModalContext } from "../../hooks/context/useFileModalContext";
import styles from "./ImageModal.module.css";
import { AiOutlineClose } from "react-icons/ai";

export default function Modal({ image }: { image: string }) {
  const { onModalClose } = useFileModalContext();

  return (
    <div className={styles.backdrop} onClick={onModalClose}>
      <div className={styles.modal}>
        <img src={image} className={styles.image} />
        <button className={styles["close-button"]} onClick={onModalClose}>
          <AiOutlineClose size={30} />
        </button>
      </div>
    </div>
  );
}
