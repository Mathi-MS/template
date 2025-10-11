import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { HiOutlinePencil } from "react-icons/hi2";
import { MdOutlineDeleteOutline } from "react-icons/md";

import CustomTable from "../Custom/CustomTable";
import CustomButton from "../Custom/CustomButton";
import DeleteConfirmationModal from "../Model/DeleteModel";
import UserModel from "../Model/UserModel";

import { useGetUsers, useDeleteUser } from "../Hooks/user";
import { showError } from "../Custom/CustomToast";

const UserTable = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data } = useGetUsers();
  const deleteUserMutation = useDeleteUser();

  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
    rowId: row.id,
  }));

  const columns = [
    { id: "sno", label: "S.No" },
    { id: "userId", label: "User ID" },
    { id: "username", label: "Username" },
    { id: "email", label: "Email" },
    { id: "mobileNo", label: "Mobile No" },
    {
      id: "pickupLocationName",
      label: "Pickup Location",
      render: (row: any) => row.pickupLocation?.locationName || "",
    },
    {
      id: "transportName",
      label: "Transport",
      render: (row: any) => row.transport?.transportId || "",
    },
    { id: "noOfPerson", label: "Persons" },
    { id: "role", label: "Role" },
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

  const handleView = (row: any) => {
    setUserData(row);
    setIsView(true);
    setIsEdit(false);
    setOpen(true);
  };

  const handleEdit = (row: any) => {
    setUserData(row);
    setIsEdit(true);
    setIsView(false);
    setOpen(true);
  };

  const openDelete = (item: any) => {
    setSelectedItem(item.id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsLoadingDelete(true);
    try {
      await deleteUserMutation.mutateAsync(selectedItem);
      handleCloseDelete();
    } catch (error: any) {
      showError(error?.message || "Failed to delete user");
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
          label="Add User"
          type="button"
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
        sortable
        colvis
        search
        exportBoolean
        title="User List"
      />

      <UserModel
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
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default UserTable;
