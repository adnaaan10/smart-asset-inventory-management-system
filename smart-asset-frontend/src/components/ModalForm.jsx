import { Dialog,DialogActions,DialogContent,DialogTitle,Button } from "@mui/material"; 


const ModalForm = ({open,title,children,onClose,onSubmit})=>{
    return(
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>

            <DialogContent dividers>{children}</DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {onSubmit && (
                    <Button onClick={onSubmit} variant="contained">
                        Save
                    </Button>
                )}
            </DialogActions>
        </Dialog>

    )
}

export default ModalForm