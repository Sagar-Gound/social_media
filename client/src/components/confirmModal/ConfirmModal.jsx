import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './confirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading = false }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modalOverlay" onClick={loading ? undefined : onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3 className="modalTitle">{title}</h3>
        </div>
        <div className="modalBody">
          <p className="modalMessage">{message}</p>
        </div>
        <div className="modalFooter">
          <button 
            className="modalButton modalCancelButton" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="modalButton modalConfirmButton" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="buttonSpinner"></div>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
