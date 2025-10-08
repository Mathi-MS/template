import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../Custom/CustomButton";
import { CustomInput } from "../Custom/CustomInput";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import { useEffect, useState } from "react";
import {
  btnStyleContainer,
  iconStyle,
  styleModalNew,
} from "../assets/Styles/CustomModelStyle";
import { locationSchema } from "../assets/Validation/Schema";
import { useGetCities } from "../Hooks/city";
import type { CityFormData } from "./CityModel";
import type { Locations } from "../Pages/Location";
import { showError } from "../Custom/CustomToast";
import { useCreateLocation, useUpdateLocation } from "../Hooks/locations";

interface LocationModelProps {
  open: boolean;
  onClose: () => void;
  onAfterSave?: (location: Locations) => void;
  userData?: any;
  isEdit?: boolean;
  isView?: boolean;
  cities?: CityFormData[];
}

const LocationModel = ({
  open,
  onClose,
  userData,
  isEdit,
  isView,
  onAfterSave,
}: LocationModelProps) => {
  const [isloading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    setError,
    formState: { errors },
  } = useForm<Locations>({
    resolver: zodResolver(locationSchema),
  });

  const { data } = useGetCities();

  const cityOptions = (data ?? []).map((d: CityFormData) => {
    return { label: d.cityName, title: d.id };
  });

  // Prefill form when editing or viewing
  useEffect(() => {
    if (open) {
      if (isEdit || isView) {
        reset({
          locationId: userData?.locationId || "",
          locationName: userData?.locationName || "",
          city: userData?.city || "",
        });
      } else {
        reset({ locationId: "", locationName: "", city: "" });
      }
    }
  }, [open, userData, isEdit, isView, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const createLocationMutation = useCreateLocation();
  const updateLocationMutation = useUpdateLocation();

  const onsubmit = async (data: any) => {
    try {
      setLoading(true);
      if (isEdit && userData?.id) {
        await updateLocationMutation.mutateAsync({
          id: userData.id ?? "",
          data,
        });
      } else {
        await createLocationMutation.mutateAsync(data);
        onAfterSave?.(data);
      }
      handleClose();
    } catch (err: any) {
      console.log(err);

      setLoading(false);
      if (err?.errors) {
        Object.keys(err.errors).forEach((field) => {
          setError(field as keyof Locations, {
            type: "manual",
            message: err.errors[field],
          });
        });
      } else {
        showError("Something went wrong while saving location");
      }
      showError("Something went wrong while saving location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        handleClose();
      }}
      sx={{ zIndex: 999999999 }}
    >
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
            {isEdit
              ? "Edit Location"
              : isView
              ? "View Location"
              : "Add New Location"}
          </Typography>
          <IconButton onClick={handleClose} sx={iconStyle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onsubmit)}
          sx={{ m: "5px 0px 20px 0px" }}
        >
          <Box sx={{ mb: 2 }}>
            <CustomAutocomplete
              label="City"
              required
              placeholder="Select your City"
              name="city"
              control={control}
              errors={errors}
              options={cityOptions}
              multiple={false}
              disabled={isView}
            />
          </Box>

          <CustomInput
            label="Location ID"
            required
            placeholder="Enter Location ID"
            type="text"
            name="locationId"
            register={register}
            errors={errors}
            disabled={isView}
            boxSx={{ mb: 2 }}
          />

          <CustomInput
            label="Location Name"
            required
            placeholder="Enter Location Name"
            type="text"
            name="locationName"
            register={register}
            errors={errors}
            disabled={isView}
          />
          {!isView && (
            <Box sx={{ ...btnStyleContainer, justifyContent: "end" }}>
              <CustomButton
                type="button"
                variant="outlined"
                label="Cancel"
                boxSx={{
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border) !important",
                }}
                onClick={handleClose}
              />
              <CustomButton
                type="submit"
                variant="contained"
                size="medium"
                label={isEdit ? "Save Changes" : "Create"}
                onClick={() => {
                  console.log(getValues());
                  console.log(errors);
                }}
                loading={isloading}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default LocationModel;
