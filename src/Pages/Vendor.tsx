import { Box, IconButton, Tooltip, Typography, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CustomButton from "../Custom/CustomButton";
import CustomTable from "../Custom/CustomTable";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { HiOutlinePencil } from "react-icons/hi";
import DeleteConfirmationModal from "../Model/DeleteModel";
import { showError } from "../Custom/CustomToast";
import { useDeleteVendor, useGetVendors } from "../Hooks/vendor";
import VendorModel from "../Model/VendorModel";

export const Vendor = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data } = useGetVendors();
  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
    cityId: row?.city?.id,
  }));

  const columns = [
    { id: "sno", label: "S.No" },
    { id: "vendorId", label: "Vendor ID" },
    { id: "vendorName", label: "Vendor Name" },
    { id: "city", label: "City", render: (row: any) => row?.city?.cityName },
    { id: "address", label: "Address" },
    { id: "email", label: "Email" },
    { id: "mobile", label: "Mobile" },
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

  const deleteVendorMutation = useDeleteVendor();

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsLoadingDelete(true);
    try {
      await deleteVendorMutation.mutateAsync(selectedItem);
      handleCloseDelete();
    } catch (error: any) {
      showError(error?.message || "Failed to delete vendor");
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
          label="Add Vendor"
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
        title="Vendor List"
      />

      <VendorModel
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
        title="Delete Vendor"
        description="Are you sure you want to delete this vendor? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};
