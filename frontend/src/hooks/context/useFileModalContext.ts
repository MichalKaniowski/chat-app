import { useContext } from "react";
import { FileModalContext } from "../../store/FileModalProvider";

export const useFileModalContext = () => {
  return useContext(FileModalContext);
};
