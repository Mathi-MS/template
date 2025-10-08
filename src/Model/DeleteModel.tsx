import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "../Custom/CustomButton";
import {
  btnStyleContainer,
  iconStyle,
  styleModalNew,
} from "../assets/Styles/CustomModelStyle";
import { showError, showSuccess } from "../Custom/CustomToast";
import { useState } from "react";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>; // async delete function passed from parent
  title?: string; // modal title
  description?: string; // modal description
  confirmLabel?: string; // text for confirm button
  cancelLabel?: string; // text for cancel button
}

const DeleteConfirmationModal = ({
  open,
  onClose,
  onDelete,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: DeleteModalProps) => {
  const [isLoading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete();
      // showSuccess(`${title} deleted successfully`);
      onClose();
    } catch (err) {
      console.error(err);
      showError(`Something went wrong while deleting ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} sx={{ zIndex: 999999999 }}>
      <Box sx={styleModalNew}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontSize: "16px",
              fontFamily: "Medium_M",
              color: "var(--text-primary)",
            }}
          >
            {title}
          </Typography>
          <IconButton onClick={handleClose} sx={iconStyle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          sx={{
            mt: 2,
            mb: 3,
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          {description}
        </Typography>

        <Box sx={{ ...btnStyleContainer, justifyContent: "end" }}>
          <CustomButton
            type="button"
            variant="outlined"
            label={cancelLabel}
            boxSx={{
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid var(--border) !important",
            }}
            onClick={handleClose}
          />
          <CustomButton
            type="button"
            variant="contained"
            size="medium"
            onClick={handleDelete}
            label={confirmLabel}
            loading={isLoading}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
