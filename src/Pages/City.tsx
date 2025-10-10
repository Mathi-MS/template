import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import CustomButton from "../Custom/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CustomTable from "../Custom/CustomTable";
import { showError, showSuccess } from "../Custom/CustomToast";
import { HiOutlinePencil } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import CityModel from "../Model/CityModel";
import { useGetCities } from "../Hooks/city";

interface Row {
  id: string;
  sno: number;
  cityId: string;
  city: string;
  locations: string[];
}

export const City = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data } = useGetCities();
  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
  }));
  const columns = [
    {
      id: "sno",
      label: "S.No",
    },
    { id: "cityId", label: "City ID" },
    { id: "cityName", label: "City" },
    {
      id: "locations",
      label: "Locations",
      render: (row: Row) => {
        if (!row.locations) {
          return "-";
        }
        const locationsArray = row.locations;
        const displayLocations = locationsArray.slice(0, 2);
        const remainingLocations = locationsArray.slice(2);

        return (
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {displayLocations.map((loc: any, index: number) => (
              <Chip
                key={index}
                label={loc.locationName}
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
                    {remainingLocations.map((loc: any, index: number) => (
                      <Typography key={index} variant="body2">
                        • {loc.locationName}
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

  // const onsubmit = () => {
  //   showSuccess(`Submitted: ${JSON.stringify(data)}`);
  //   handleClose();
  // };

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
        rows={numberedRows}
        columns={columns}
        showCheckbox={false}
        sortable={true}
        colvis={true}
        search={true}
        exportBoolean={true}
        title="City List"
      />

      <CityModel
        open={open}
        onClose={handleClose}
        // onSubmit={onsubmit}
        userData={userData}
        isEdit={isEdit}
        isView={isView}
      />
    </>
  );
};
