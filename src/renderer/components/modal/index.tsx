import { useEffect, useRef } from 'react';
import './index.css';

interface ModalProps {
  onClose: () => void;
  isOpened?: boolean;
  width?: number,
  height?: number,
  padding?: string,
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  isOpened,
  width,
  height,
  children,
  padding
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpened) {
      window.addEventListener('mousedown', handleOutsideClick)
      return () => {
        window.removeEventListener('mousedown', handleOutsideClick)
      }
    }

    return () => {}
  }, [isOpened])

  const handleOutsideClick = (e: any) => {
    if (!modalRef.current?.contains(e.target)) {
      onClose();
    }
  }

  return (
    <div className={`modal-wrapper ${isOpened ? 'opened' : ''}`}>
      <div 
        className="modal" 
        style={{
          width: width || 'auto',
          height: height || 'auto',
          padding: padding || undefined,
        }}
        ref={modalRef}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
