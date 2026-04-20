import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle, Info, X } from 'lucide-react';
import './GlobalDialog.css';

export default function GlobalDialog() {
    const [dialog, setDialog] = useState(null);

    useEffect(() => {
        const handleShowDialog = (e) => {
            setDialog(e.detail);
        };

        window.addEventListener('show-dialog', handleShowDialog);
        return () => window.removeEventListener('show-dialog', handleShowDialog);
    }, []);

    if (!dialog) return null;

    const handleClose = (result = false) => {
        if (dialog.resolve) {
            dialog.resolve(result);
        }
        setDialog(null);
    };

    return ReactDOM.createPortal(
        <div className="global-dialog-overlay animate-fade-in">
            <div className="global-dialog-modal animate-slide-up">
                <button className="global-dialog-close" onClick={() => handleClose(false)}>
                    <X size={18} />
                </button>
                <div className="global-dialog-header">
                    {dialog.type === 'confirm' ? (
                        <div className="global-dialog-icon confirm">
                            <AlertTriangle size={24} />
                        </div>
                    ) : (
                        <div className="global-dialog-icon alert">
                            <Info size={24} />
                        </div>
                    )}
                    <h3>{dialog.title}</h3>
                </div>
                <div className="global-dialog-body">
                    <p>{dialog.message}</p>
                </div>
                <div className="global-dialog-footer">
                    {dialog.type === 'confirm' && (
                        <button className="btn btn-outline" onClick={() => handleClose(false)}>
                            Cancel
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={() => handleClose(true)}>
                        OK
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
