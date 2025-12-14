import { useEffect } from "react";
import "./confirmDialog.css"

type AlertType = "success" | "error" | "warning" | "info" | "confirm"

interface ConfirmDialogProps{
    open : boolean,
    type? : AlertType
    title? : string,
    message? : string,
    confirmText? : string,
    cancelText? : string,
    entity? : string,
    showDeleteButton? : boolean
    onConfirm:() => void,
    onCancel:() => void
}

const ConfirmDialog : React.FC<ConfirmDialogProps> = ({open,title = "Confirmar eliminación",
    message="¿Estás seguro que deseas eliminar esta ${}?"
    ,confirmText = "Confirmar"
    ,cancelText = "Cancelar",
    showDeleteButton = true,
    type = 'info',
onConfirm,onCancel}) =>{
            useEffect(() => {
                    if (open) {
                        document.body.style.overflow = "hidden"
                    } else {
                    document.body.style.overflow = "unset"
                    }
                    return () => {
                    document.body.style.overflow = "unset"
                    }
                }, [open])

                if (!open) return null 
                    const defaultTitles = {
                success: "¡Éxito!",
                error: "Error",
                warning: "Advertencia",
                info: "Información",
                confirm: "Confirmar acción",
                }
                const finalTitle = title || defaultTitles[type]

                            const renderIcon = () => {
                switch (type) {
                case "success":
                    return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9 12l2 2 4-4" />
                    </svg>
                    )
                case "error":
                    return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    )
                case "warning":
                    return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    )
                case "info":
                    return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    )
                case "confirm":
                    return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    )
                }
            }

                            const handleClose = () => {
                    if (onCancel) {
                    onCancel()
                    } else if (onConfirm) {
                    onConfirm()
                    }
                }

                const handleConfirm = () => {
                    if (onConfirm) {
                    onConfirm()
                    }
                }

            return (
                                <div className="alert-dialog-overlay" onClick={handleClose}>
                    <div className="alert-dialog-container" onClick={(e) => e.stopPropagation()}>
                        <div className="alert-dialog-header">
                        <h3 className="alert-dialog-title">{finalTitle}</h3>
                        <button className="alert-dialog-close" onClick={handleClose}>
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        </div>

                        <div className="alert-dialog-content">
                        <div className={`alert-dialog-icon alert-dialog-icon-${type}`}>{renderIcon()}</div>
                        <p className="alert-dialog-message">{message}</p>
                        </div>

                        <div className="alert-dialog-actions">
                        {showDeleteButton && (
                            <button className="alert-dialog-cancel-button" onClick={handleClose}>
                            {cancelText}
                            </button>
                        )}
                        <button className={`alert-dialog-confirm-button alert-dialog-confirm-${type}`} onClick={handleConfirm}>
                            {confirmText}
                        </button>
                        </div>
                    </div>
                    </div>
            )
}

export default ConfirmDialog