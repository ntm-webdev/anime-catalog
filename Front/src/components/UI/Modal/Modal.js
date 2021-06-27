import ReactDOM from "react-dom";

import styles from "./Modal.module.css";

const Backdrop = ({ onClose }) => (
  <div className={styles.backdrop} onClick={onClose} />
);

const ModalOverlay = ({ onClose, children }) => (
  <div className={styles.modal}>
    <span className={styles.close} onClick={onClose}>
      <i className="fa fa-times" />
    </span>
    <div className={styles.content}>{children}</div>
  </div>
);

const portalElement = document.getElementById("overlays");

const Modal = ({ onClose, children }) => (
  <>
    {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
    {ReactDOM.createPortal(
      <ModalOverlay onClose={onClose}>{children}</ModalOverlay>,
      portalElement
    )}
  </>
);

export default Modal;
