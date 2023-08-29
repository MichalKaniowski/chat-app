import { createContext, useState } from "react";

const ModalContext = createContext({
  isModalOpen: false,
  image: "",
  onImageChange: (image: string) => {},
  onModalClose: () => {},
});

export default ModalContext;

export function ModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState("");

  function imageChangeHandler(image: string) {
    setIsModalOpen(true);
    setImage(image);
  }

  function closeModalHandler() {
    setIsModalOpen(false);
    setImage("");
  }

  const value = {
    isModalOpen,
    image,
    onImageChange: imageChangeHandler,
    onModalClose: closeModalHandler,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}
