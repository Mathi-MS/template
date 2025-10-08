import { Box, Typography, IconButton, Modal } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineRemoveRedEye, MdEdit } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";

import CustomTable from "../Custom/CustomTable";
import TicketModal from "../Model/TicketModel";
import CustomButton from "../Custom/CustomButton";
import { useGetMyTickets, useUpdateRemarks } from "../Hooks/ticket";
import { btnStyleContainer, iconStyle, styleModalNew } from "../assets/Styles/CustomModelStyle";
import { CustomInput } from "../Custom/CustomInput";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";

export const Tickets = () => {
  const { data } = useGetMyTickets();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const { mutate: updateRemarks, isPending: isLoading } = useUpdateRemarks();

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      remarks: "",
      dropLocation: "",
    },
  });

  // 📦 Handlers
  const handleView = (ticket: any) => {
    setSelectedTicket(ticket);
    setOpen(true);
  };

  const handleEdit = (ticket: any) => {
    setSelectedTicket(ticket);
    reset({
      remarks: ticket?.remarks || "",
      dropLocation: ticket?.dropLocation?.id || "",
    });
    setEditOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTicket(null);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedTicket(null);
  };

  const onSubmit = (formData: any) => {
    if (!selectedTicket) return;
    updateRemarks(
      {
        id: selectedTicket.id,
        remarks: formData.remarks,
        dropLocation: formData.dropLocation || undefined,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedTicket(null);
        },
      }
    );
  };

  // 🔢 Table Data
  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
  }));

  const columns = [
    { id: "sno", label: "S.No" },
    { id: "userId", label: "Recipient Name" },
    {
      id: "pickupLocation",
      label: "Pickup Location",
      render: (row: any) => row.pickupLocation?.locationName,
    },
    { id: "date", label: "Date" },
    { id: "status", label: "Status" },
    {
      id: "action",
      label: "Action",
      render: (row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleView(row)} size="small">
            <MdOutlineRemoveRedEye
              style={{ color: "var(--grey)", fontSize: "16px" }}
            />
          </IconButton>
          <IconButton onClick={() => handleEdit(row)} size="small">
            <MdEdit style={{ color: "var(--grey)", fontSize: "16px" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  // 🏙 Drop Location Options (excluding pickup)
  const locationOptions =
    selectedTicket?.city?.locations
      ?.filter((loc: any) => loc.id !== selectedTicket?.pickupLocation?.id)
      ?.map((loc: any) => ({
        label: loc.locationName,
        title: loc.id,
      })) || [];

  return (
    <Box>
      <CustomTable
        rows={numberedRows}
        columns={columns}
        showCheckbox={false}
        sortable
        colvis
        search
        exportBoolean
        title="My Tickets"
      />

      {/* 👁 View Ticket Modal */}
      <TicketModal
        open={open}
        onClose={handleClose}
        userData={selectedTicket}
      />

      {/* ✏️ Edit Remarks Modal */}
      <Modal
        open={editOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          handleEditClose();
        }}
        sx={{ zIndex: 999999999 }}
      >
        <Box sx={styleModalNew}>
          {/* Header */}
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
              Edit Remarks & Drop Location
            </Typography>
            <IconButton onClick={handleEditClose} sx={iconStyle}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ m: "10px 0px 20px 0px" }}
          >
            <Box sx={{ mb: 2 }}>
              <CustomInput
                label="Remarks"
                required
                placeholder="Enter your remarks"
                type="text"
                name="remarks"
                register={register}
                errors={errors}
              />
            </Box>

            <CustomAutocomplete
              label="Drop Location"
              required
              placeholder="Select Drop Location"
              name="dropLocation"
              control={control}
              errors={errors}
              options={locationOptions}
              multiple={false}
            />

            <Box sx={{ ...btnStyleContainer, justifyContent: "end", mt: 3 }}>
              <CustomButton
                type="button"
                variant="outlined"
                label="Cancel"
                boxSx={{
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border) !important",
                }}
                onClick={handleEditClose}
              />
              <CustomButton
                type="submit"
                variant="contained"
                size="medium"
                label="Save Changes"
                loading={isLoading}
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
