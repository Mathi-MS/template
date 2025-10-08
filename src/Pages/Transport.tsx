import { useState } from "react";
import { Box, Button, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import CustomTable from "../Custom/CustomTable";
import { useDeleteTransport, useGetTransports } from "../Hooks/transport";
import AddIcon from "@mui/icons-material/Add";

import CustomButton from "../Custom/CustomButton";
import { HiOutlinePencil } from "react-icons/hi2";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { showError } from "../Custom/CustomToast";
import TransportModel from "../Model/TransportModel";
import DeleteConfirmationModal from "../Model/DeleteModel";

const TransportTable = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data } = useGetTransports();
  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
    rowId: row.id,
  }));

  const columns = [
    { id: "sno", label: "S.No" },
    { id: "transportId", label: "Transport ID" },
    { id: "ownerDetails", label: "Owner Details" },
    { id: "contact", label: "Contact" },
    { id: "type", label: "Type" },
    { id: "seater", label: "Seater" },
    { id: "city", label: "City",render:(row: any) => (row?.city?.cityName) },
    {
      id: "action",
      label: "Action",
      render: (row: any) => (
        <Box sx={{ display: "flex", gap: "8px" }}>
          <IconButton onClick={() => handleView(row)} size="small">
            <MdOutlineRemoveRedEye
              style={{ color: "var(--grey)", fontSize: "16px" }}
            />
          </IconButton>
          <IconButton onClick={() => handleEdit(row)} size="small">
            <HiOutlinePencil
              style={{ color: "var(--grey)", fontSize: "16px" }}
            />
          </IconButton>
          <IconButton onClick={() => openDelete(row)} size="small">
            <MdOutlineDeleteOutline
              style={{ color: "var(--grey)", fontSize: "16px" }}
            />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleView = (data: any) => {
    setUserData(data);
    setIsView(true);
    setIsEdit(false);
    setOpen(true);
  };

  const handleEdit = (data: any) => {
    setUserData(data);
    setIsEdit(true);
    setIsView(false);
    setOpen(true);
  };

  const openDelete = (item: any) => {
    setSelectedItem(item.id);
    setDeleteOpen(true);
  };

  const deleteTransportMutation = useDeleteTransport();

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsLoadingDelete(true);
    try {
      await deleteTransportMutation.mutateAsync(selectedItem);
      handleCloseDelete();
    } catch (error: any) {
      showError(error?.message || "Failed to delete transport");
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const handleCloseDelete = () => {
    setSelectedItem("");
    setDeleteOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setIsView(false);
    setUserData({});
  };

  return (
    <>
      <Box
        sx={{
          my: "25px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "@media (max-width: 600px)": { flexDirection: "column", gap: "10px" },
        }}
      >
        <CustomButton
          label="Add Transport"
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          boxSx={{
            width: "max-content",
            "@media (max-width: 600px)": { width: "100%" },
          }}
        />
      </Box>

      <CustomTable
        rows={numberedRows}
        columns={columns}
        showCheckbox={false}
        sortable={true}
        colvis={true}
        search={true}
        exportBoolean={true}
        title="Transport List"
      />

      <TransportModel
        open={open}
        onClose={handleClose}
        userData={userData}
        isEdit={isEdit}
        isView={isView}
      />

      <DeleteConfirmationModal
        open={deleteOpen}
        onClose={handleCloseDelete}
        onDelete={handleDelete}
        title="Delete Transport"
        description="Are you sure you want to delete this transport? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default TransportTable;
