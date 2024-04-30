import { createContext, useState } from "react";

interface FileModalContextType {
  isModalOpen: boolean;
  file: string;
  onFileChange: (image: string) => void;
  onModalClose: () => void;
}

export const FileModalContext = createContext<FileModalContextType>({
  isModalOpen: false,
  file: "",
  onFileChange: () => {},
  onModalClose: () => {},
});

export function ModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState("");

  function fileChangeHandler(image: string) {
    setIsModalOpen(true);
    setFile(image);
  }

  function closeModalHandler() {
    setIsModalOpen(false);
    setFile("");
  }

  const value = {
    isModalOpen,
    file,
    onFileChange: fileChangeHandler,
    onModalClose: closeModalHandler,
  };

  return (
    <FileModalContext.Provider value={value}>
      {children}
    </FileModalContext.Provider>
  );
}
