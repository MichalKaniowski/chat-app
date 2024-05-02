import { useFileModalContext } from "../../hooks/context/useFileModalContext";
import styles from "./FileModal.module.css";
import { AiOutlineClose } from "react-icons/ai";

export default function FileModal({ fileUrl }: { fileUrl: string }) {
  const { onModalClose } = useFileModalContext();

  const imageExtensions = ["jpg", "jpeg", "png"];
  const videoExtensions = ["mp4", "webm"];

  const fileExtension = fileUrl.split(".").at(-1) as string;
  const isFileImage = imageExtensions.includes(fileExtension);
  const isFileVideo = videoExtensions.includes(fileExtension);

  return (
    <div className={styles.backdrop} onClick={onModalClose}>
      <div className={styles.modal}>
        {isFileImage && <img src={fileUrl} className={styles.file} />}
        {isFileVideo && (
          <video src={fileUrl} controls={true} className={styles.file} />
        )}

        <button className={styles["close-button"]} onClick={onModalClose}>
          <AiOutlineClose size={30} />
        </button>
      </div>
    </div>
  );
}
