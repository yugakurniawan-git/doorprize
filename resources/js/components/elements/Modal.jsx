import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { createContext, useContext, useEffect } from "react";

const ModalContext = createContext(null);
export const useModal = () => useContext(ModalContext);

const Header = ({ children }) => {
  const { onClose } = useModal();
  return (
    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
      <h3 className="text-lg font-semibold">{children}</h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none cursor-pointer"
        aria-label="Close"
        type="button"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

const Body = ({ children, ...props }) => (
  <div className="p-4 max-h-[70vh] overflow-y-auto" {...props}>
    {children}
  </div>
);
const Footer = ({ children, className }) => (
  <div className={`border-t border-slate-300 pt-4 ${className ?? 'flex justify-end items-center gap-2'}`}>
    {children}
  </div>
);

const Modal = ({ show, onClose, children, size = "w-md" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <ModalContext.Provider value={{ onClose }}>
      <div
        className={`
          w-screen h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/50
          transition-opacity duration-200
          ${show ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div
          className={`
            bg-white rounded-lg shadow-lg p-6 max-h-[92vh]
            transform transition-all duration-400 ease-out
            ${ show ? "opacity-100 scale-100" : "opacity-0 scale-85 pointer-events-none" }
            ${size}
          `}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
