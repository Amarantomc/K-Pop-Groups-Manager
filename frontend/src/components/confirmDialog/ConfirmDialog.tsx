import {DialogContent,DialogActions,Button,Slide, Dialog, DialogTitle, DialogContentText} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import React, { forwardRef } from "react";

const Transition = forwardRef(function Transition(props : TransitionProps & {children : React.ReactElement}, ref : React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmDialogProps{
    open : boolean,
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
onConfirm,onCancel}) =>{ 
            return (
                <React.Fragment>
                <Dialog open={open} slots={{transition : Transition}} keepMounted onClose={onCancel}  aria-describedby="alert-dialog-slide-description"
                fullWidth maxWidth='sm'>
                    <DialogTitle sx={{fontWeight:600}}>{title}</DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {message}
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={onCancel}>
                            {cancelText}
                        </Button>

                        {showDeleteButton && (<Button onClick={onConfirm}>
                            {confirmText}
                        </Button>)}
                    </DialogActions>
                </Dialog>
                </React.Fragment>
            )
}

export default ConfirmDialog