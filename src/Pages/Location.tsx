import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import CustomButton from "../Custom/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CustomTable from "../Custom/CustomTable";
import { showError, showSuccess } from "../Custom/CustomToast";
import { HiOutlinePencil } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import LocationModel from "../Model/LocationModel";

interface Row {
  id: string;
  sno: number;
  locationId: string;
  location: string;
  city: string;
}

export const Location = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Dummy data
  const rows: Row[] = [
    {
      id: "1",
      sno: 1,
      locationId: "L001",
      location: "Anna Nagar",
      city: "Chennai",
    },
    {
      id: "2",
      sno: 2,
      locationId: "L002",
      location: "T Nagar",
      city: "Chennai",
    },
    {
      id: "3",
      sno: 3,
      locationId: "L003",
      location: "Velachery",
      city: "Chennai",
    },
    {
      id: "4",
      sno: 4,
      locationId: "L004",
      location: "Whitefield",
      city: "Bengaluru",
    },
    {
      id: "5",
      sno: 5,
      locationId: "L005",
      location: "Koramangala",
      city: "Bengaluru",
    },
    {
      id: "6",
      sno: 6,
      locationId: "L006",
      location: "Madhapur",
      city: "Hyderabad",
    },
    {
      id: "7",
      sno: 7,
      locationId: "L007",
      location: "Gachibowli",
      city: "Hyderabad",
    },
    {
      id: "8",
      sno: 8,
      locationId: "L008",
      location: "Andheri",
      city: "Mumbai",
    },
    {
      id: "9",
      sno: 9,
      locationId: "L009",
      location: "Connaught Place",
      city: "Delhi",
    },
    {
      id: "10",
      sno: 10,
      locationId: "L010",
      location: "Salt Lake",
      city: "Kolkata",
    },
  ];

  const columns = [
    { id: "sno", label: "S.No" },
    { id: "locationId", label: "Location ID" },
    { id: "location", label: "Location" },
    { id: "city", label: "City" },
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
    setOpen(true);
  };

  const handleEdit = (data: any) => {
    setUserData(data);
    setIsEdit(true);
    setOpen(true);
  };

  const openDelete = (item: any) => {
    setSelectedItem(item.id);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    setIsLoadingDelete(true);
    setTimeout(() => {
      handleClosetDelete();
      showSuccess("Deleted Successfully (Dummy)");
      setIsLoadingDelete(false);
    }, 1000);
  };

  const handleClosetDelete = () => {
    setSelectedItem("");
    setDeleteOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setIsView(false);
    setUserData({});
  };

  const onsubmit = (data: any) => {
    showSuccess(`Submitted: ${JSON.stringify(data)}`);
    handleClose();
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
          label="Add Location"
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
        rows={rows}
        columns={columns}
        showCheckbox={false}
        sortable={true}
        colvis={true}
        search={true}
        exportBoolean={true}
        title="Location List"
      />

      <LocationModel
        open={open}
        onClose={handleClose}
        onSubmit={onsubmit}
        userData={userData}
        isEdit={isEdit}
        isView={isView}
      />
    </>
  );
};
