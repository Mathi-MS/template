import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import CustomButton from "../Custom/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CustomTable from "../Custom/CustomTable";
import { showError, showSuccess } from "../Custom/CustomToast";
import { HiOutlinePencil } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";

interface Row {
  id: string;
  sno: number;
  cityId: string;
  city: string;
  locations: string;
}

export const City = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Dummy data
  const rows: Row[] = [
    {
      id: "1",
      sno: 1,
      cityId: "C001",
      city: "Chennai",
      locations: "Anna Nagar, T Nagar, Velachery, Adyar",
    },
    {
      id: "2",
      sno: 2,
      cityId: "C002",
      city: "Bengaluru",
      locations: "Whitefield, Koramangala, Indiranagar",
    },
    {
      id: "3",
      sno: 3,
      cityId: "C003",
      city: "Hyderabad",
      locations: "Madhapur, Gachibowli, Banjara Hills, Jubilee Hills",
    },
    {
      id: "4",
      sno: 4,
      cityId: "C004",
      city: "Mumbai",
      locations: "Andheri, Bandra, Powai, Dadar",
    },
    {
      id: "5",
      sno: 5,
      cityId: "C005",
      city: "Delhi",
      locations: "Connaught Place, Saket, Dwarka",
    },
    {
      id: "6",
      sno: 6,
      cityId: "C006",
      city: "Kolkata",
      locations: "Salt Lake, Howrah, Park Street",
    },
    {
      id: "7",
      sno: 7,
      cityId: "C007",
      city: "Pune",
      locations: "Kothrud, Baner, Hinjewadi",
    },
    {
      id: "8",
      sno: 8,
      cityId: "C008",
      city: "Coimbatore",
      locations: "RS Puram, Peelamedu, Singanallur",
    },
    {
      id: "9",
      sno: 9,
      cityId: "C009",
      city: "Jaipur",
      locations: "Vaishali Nagar, Malviya Nagar, C-Scheme",
    },
    {
      id: "10",
      sno: 10,
      cityId: "C010",
      city: "Ahmedabad",
      locations: "Navrangpura, Bopal, Satellite",
    },
  ];

  const columns = [
    { id: "sno", label: "S.No" },
    { id: "cityId", label: "City ID" },
    { id: "city", label: "City" },
    {
      id: "locations",
      label: "Locations",
      render: (row: Row) => {
        const locationsArray = row.locations.split(", ");
        const displayLocations = locationsArray.slice(0, 2);
        const remainingLocations = locationsArray.slice(2);

        return (
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {displayLocations.map((loc: string, index: number) => (
              <Chip
                key={index}
                label={loc}
                sx={{
                  backgroundColor: "var(--backgroundInner)",
                  color: "var(--primary)",
                  border: "solid 1px var(--border)",
                  fontWeight: 500,
                  borderRadius: "4px",
                  fontFamily: "Medium_M",
                }}
                size="small"
              />
            ))}

            {remainingLocations.length > 0 && (
              <Tooltip
                title={
                  <Box sx={{ display: "flex", flexDirection: "column", p: 1 }}>
                    {remainingLocations.map((loc: string, index: number) => (
                      <Typography key={index} variant="body2">
                        • {loc}
                      </Typography>
                    ))}
                  </Box>
                }
                arrow
                placement="top"
              >
                <Chip
                  label={`+${remainingLocations.length} more`}
                  sx={{
                    backgroundColor: "var(--primary)",
                    color: "var(--backgroundInner)",
                    border: "solid 1px var(--border)",
                    fontWeight: 500,
                    borderRadius: "4px",
                    fontFamily: "Medium_M",
                  }}
                  size="small"
                />
              </Tooltip>
            )}
          </Box>
        );
      },
    },
    {
      id: "action",
      label: "Action",
      render: (row: any) => (
        <Box sx={{ display: "flex", gap: "8px" }}>
          <IconButton onClick={() => handleView(row)} size="small">
            <MdOutlineRemoveRedEye  style={{ color: "var(--grey)", fontSize: "16px" }} />
          </IconButton>
          <IconButton onClick={() => handleEdit(row)} size="small">
            <HiOutlinePencil   style={{ color: "var(--grey)", fontSize: "16px" }} />
          </IconButton>
          <IconButton onClick={() => openDelete(row)} size="small">
            <MdOutlineDeleteOutline  style={{ color: "var(--grey)", fontSize: "16px" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleView = (data: any) => {
    showSuccess(`Viewing: ${data.city}`);
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
          label="Add City"
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
        title="City List"
      />

      {/* <CustomUserModel
        open={open}
        onClose={handleClose}
        onSubmit={onsubmit}
        userData={userData}
        isEdit={isEdit}
      />

      <CustomDeleteModel
        open={deleteOpen}
        onClose={handleClosetDelete}
        onDelete={handleDelete}
        itemData={selectedItem}
        isLoading={isLoadingDelete}
      /> */}
    </>
  );
};
