import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/Modal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [content, setContent] = useState(null);

  const openModal = useCallback((jsx) => {
    setContent(() => jsx);
  }, []);

  const closeModal = () => setContent(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {content && <Modal>{content}</Modal>}
    </ModalContext.Provider>
  );
};
