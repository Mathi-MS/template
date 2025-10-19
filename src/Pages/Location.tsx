import { Box, IconButton } from "@mui/material";
import CustomButton from "../Custom/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import CustomTable from "../Custom/CustomTable";
import { showError } from "../Custom/CustomToast";
import { HiOutlinePencil } from "react-icons/hi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import LocationModel from "../Model/LocationModel";
import { useDeleteLocation, useGetLocations } from "../Hooks/locations";
import DeleteConfirmationModal from "../Model/DeleteModel";
import { useGetLocationCostById } from "../Hooks/locationcost";
import { useGetCities } from "../Hooks/city";
import LocationCostModel from "../Model/LOcationCostModel";

export interface Locations {
  id?: string;
  locationId: string;
  locationName: string;
  city: string;
}

export const Location = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<Locations>({
    id: "",
    city: "",
    locationId: "",
    locationName: "",
  });
  const [editableData, setIsEditableData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [openCostModal, setOpenCostModal] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [isViewCost, setIsViewCost] = useState(false);

  const { data } = useGetLocations();
  const { data: cities, refetch: refetchCities } = useGetCities();
  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
  }));
  const { data: locationCosts } = useGetLocationCostById(
    selectedCityId ?? "",
    !!selectedCityId
  );

  const deleteLocationMutation = useDeleteLocation();

  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsLoadingDelete(true);
    try {
      await deleteLocationMutation.mutateAsync(selectedItem);
      handleClosetDelete();
    } catch (error: any) {
      showError(error?.message || "Failed to delete location");
    } finally {
      setIsLoadingDelete(false);
    }
  };
  const handleAfterSaveLocation = async (newLocation: Locations) => {
    const cityId = newLocation.city;
    const { data: freshCities } = await refetchCities();
    const city = (freshCities ?? []).find((c: any) => c.id === cityId);
    if (!city) return;

    if (city.locations?.length < 2) {
      // showError("At least 2 locations required to create cost combinations.");
      return;
    }

    setSelectedCityId(cityId);
  };

useEffect(() => {
  if (!selectedCityId) return;

  const city = (cities ?? []).find((c: any) => c.id === selectedCityId);
  if (!city) return;

  const existingCosts = locationCosts?.locationCostDetails ?? [];
  const cityLocations = city.locations ?? [];

  // At least 2 locations are required to generate combinations
  if (cityLocations.length < 2) {
    // showError("At least 2 locations required to create cost combinations.");
    return;
  }

  // 🧩 Build all pickup/drop combinations
  const mergedCombinations: any[] = [];
  for (let i = 0; i < cityLocations.length; i++) {
    for (let j = 0; j < cityLocations.length; j++) {
      if (i !== j) {
        const existing = existingCosts.find(
          (lc: any) =>
            lc.pickupLocation?.id === cityLocations[i].id &&
            lc.dropLocation?.id === cityLocations[j].id
        );

        mergedCombinations.push({
          pickup: cityLocations[i].id,
          pickupLocation: cityLocations[i].locationName,
          drop: cityLocations[j].id,
          dropLocation: cityLocations[j].locationName,
          cost: existing ? existing.cost : "",
          isCostReadonly: !!existing?.cost,
        });
      }
    }
  }

  // 🧠 Determine mode based on presence of cost details
  const hasExistingCosts = existingCosts.length > 0;

  setIsViewCost(hasExistingCosts);
  setIsEditableData({
    cityName: city.cityName,
    city: city.id,
    cityId: city.cityId,
    locations: city.locations,
    locationCostDetails: mergedCombinations,
  });

  // ✅ Always open the modal (both cases)
  setOpenCostModal(true);
}, [locationCosts, selectedCityId, cities]);


  const columns = [
    { id: "sno", label: "S.No" },
    { id: "locationId", label: "Location ID" },
    { id: "locationName", label: "Location" },
    { id: "cityName", label: "City" },
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

  const handleClosetDelete = () => {
    setSelectedItem("");
    setDeleteOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setIsView(false);
    setOpenCostModal(false);
    setIsViewCost(false);
    setSelectedCityId(null);
    setUserData({
      id: "",
      city: "",
      locationId: "",
      locationName: "",
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
        rows={numberedRows}
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
        userData={userData}
        isEdit={isEdit}
        isView={isView}
        onAfterSave={handleAfterSaveLocation}
        cities={cities || []}
      />

      <DeleteConfirmationModal
        open={deleteOpen}
        onClose={handleClosetDelete}
        onDelete={handleDelete}
        title="Delete Location"
        description="Are you sure you want to delete this Location? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      <LocationCostModel
        open={openCostModal}
        onClose={handleClose}
        isEdit={isViewCost}
        userData={editableData}
      />
    </>
  );
};
