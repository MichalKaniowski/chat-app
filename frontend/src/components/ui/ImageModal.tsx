import { useContext } from "react";
import ModalContext from "../../store/ModalProvider";
import styles from "./ImageModal.module.css";
import { AiOutlineClose } from "react-icons/ai";

export default function Modal({ image }: { image: string }) {
  const { onModalClose } = useContext(ModalContext);

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
