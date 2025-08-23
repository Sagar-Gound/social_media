import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './toast.css';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div className={`toast toast-${type}`}>
      <div className="toastContent">
        <div className="toastIcon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'info' && 'ℹ'}
        </div>
        <span className="toastMessage">{message}</span>
        <button className="toastClose" onClick={onClose}>
          ×
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Toast;
