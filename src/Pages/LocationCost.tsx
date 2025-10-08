import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import CustomButton from "../Custom/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CustomTable from "../Custom/CustomTable";
import { showError } from "../Custom/CustomToast";
import { HiOutlinePencil } from "react-icons/hi";
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import DeleteConfirmationModal from "../Model/DeleteModel";
import LocationCostModel from "../Model/LOcationCostModel";
import { useGetLocationCosts } from "../Hooks/locationcost";

interface Row {
  id: string;
  sno: number;
  locationCostId: string;
  locationName: string;
  city: string;
  cost: number;
}

export interface LocationCost {
  id?: string;
  locationCostId: string;
  locationName: string;
  city: string;
  cost: number;
}

export const LocationCost = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isLocationCost, setIsLocationCost] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const { data } = useGetLocationCosts();
  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
    id: row.id,
    cityName: row.city.cityName,
    city: row.city.id,
    cityId: row.city.cityId,
    locations: row.city.locations,
    locationCostDetails: row.locationCostDetails,
  }));

//   const deleteLocationCostMutation = useDeleteLocationCost();

  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsLoadingDelete(true);
    // try {
    //   await deleteLocationCostMutation.mutateAsync(selectedItem);
    //   handleCloseDelete();
    // } catch (error: any) {
    //   showError(error?.message || "Failed to delete location cost");
    // } finally {
    //   setIsLoadingDelete(false);
    // }
  };

  const columns = [
    {
      id: "sno",
      label: "S.No",
    },
    { id: "cityId", label: "City ID", },
    { id: "cityName", label: "City" },
    {
      id: "locations",
      label: "Locations",
      render: (row: any) => {
        if (!row.locations) {
          return "-";
        }
        const locationsArray = row.locations;
        const displayLocations = locationsArray.slice(0, 2);
        const remainingLocations = locationsArray.slice(2);

        return (
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {displayLocations.map(
              (loc: { locationName: string }, index: number) => (
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
              )
            )}

            {remainingLocations.length > 0 && (
              <Tooltip
                title={
                  <Box sx={{ display: "flex", flexDirection: "column", p: 1 }}>
                    {remainingLocations.map(
                      (loc: { locationName: string }, index: number) => (
                        <Typography key={index} variant="body2">
                          • {loc.locationName}
                        </Typography>
                      )
                    )}
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

  const handleView = (data: Row) => {
    setUserData(data);
    setIsView(true);
    setOpen(true);
  };

  const handleEdit = (data: Row) => {
    setUserData(data);
    setIsEdit(true);
    setIsLocationCost(true);
    setOpen(true);
  };

  const openDelete = (item: Row) => {
    setSelectedItem(item.id);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setSelectedItem("");
    setDeleteOpen(false);
    setIsLocationCost(false);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setIsView(false);
    setUserData({
      id: "",
      locationCostId: "",
      locationName: "",
      city: "",
      cost: 0,
    });
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
          label="Add Location Cost"
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
        title="Location Cost List"
      />

      <LocationCostModel
        open={open}
        onClose={handleClose}
        userData={userData}
        isEdit={isEdit}
        isView={isView}
        isLocationCost={isLocationCost}
      />

      <DeleteConfirmationModal
        open={deleteOpen}
        onClose={handleCloseDelete}
        onDelete={handleDelete}
        title="Delete Location Cost"
        description="Are you sure you want to delete this Location Cost? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
};
