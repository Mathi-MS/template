import { Box, IconButton, InputAdornment, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import CustomButton from "../Custom/CustomButton";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import { CustomInput } from "../Custom/CustomInput";
import { useEffect, useState } from "react";
import {
  styleModalNew,
  btnStyleContainer,
  iconStyle,
} from "../assets/Styles/CustomModelStyle";
import { showError } from "../Custom/CustomToast";
import { useGetCities } from "../Hooks/city";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateLocationCost,
  useUpdateLocationCost,
} from "../Hooks/locationcost";

interface LocationCostRow {
  pickupLocation: string;
  pickup: string;
  dropLocation: string;
  drop: string;
  cost: string;
  isCostReadonly?: boolean;
}

interface LocationCostForm {
  city: string;
  locationCosts: LocationCostRow[];
}

interface LocationCostModelProps {
  open: boolean;
  onClose: () => void;
  userData?: any;
  isEdit?: boolean;
  isView?: boolean;
  isLocationCost?: boolean;
}

const LocationCostModel = ({
  open,
  onClose,
  userData,
  isEdit,
  isView,
  isLocationCost,
}: LocationCostModelProps) => {
  const locationCostRowSchema = z.object({
    pickupLocation: z.string(),
    dropLocation: z.string(),
    cost: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z
        .number({ error: "Cost must be a number" })
        .min(1, "Cost must be positive")
    ),
  });

  const locationCostFormSchema = z.object({
    city: z.string().nonempty("City is required"),
    locationCosts: z
      .array(locationCostRowSchema)
      .min(1, "At least one location cost is required"),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { data: cities } = useGetCities();

  const {
    control,
    handleSubmit,
    reset,
    register,
    getValues,
    watch,
    formState: { errors },
  } = useForm<LocationCostForm>({
    resolver: zodResolver(locationCostFormSchema),
    defaultValues: {
      city: "",
      locationCosts: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "locationCosts",
  });

  const selectedCity = watch("city");

  const { mutate: createLocationCost } = useCreateLocationCost();
  useEffect(() => {
    if (userData) {
      reset({
        city: userData.city || "",
        locationCosts:
          userData.locationCostDetails?.map((lc: any) => ({
            pickup: lc.pickupLocation?.id || lc.pickup,
            pickupLocation:
              lc.pickupLocation?.locationName || lc.pickupLocation || "",
            drop: lc.dropLocation?.id || lc.drop,
            dropLocation:
              lc.dropLocation?.locationName || lc.dropLocation || "",
            cost: lc.cost?.toString() || "",
            isCostReadonly: lc.cost ? true : false,
          })) || [],
      });
    }
  }, [userData, reset]);

  useEffect(() => {
    if ((isEdit || isView) && userData) return;
    if (selectedCity) {
      const selectedCityObj = (cities ?? []).find(
        (c: any) => c.id === selectedCity
      );
      const cityLocations = selectedCityObj?.locations ?? [];
      if (cityLocations.length < 2) {
        showError("At least 2 locations required to create cost combinations.");
        replace([]);
        return;
      }

      const combinations = [];
      for (let i = 0; i < cityLocations.length; i++) {
        for (let j = 0; j < cityLocations.length; j++) {
          if (i !== j) {
            combinations.push({
              pickup: cityLocations[i].id,
              pickupLocation: cityLocations[i].locationName,
              drop: cityLocations[j].id,
              dropLocation: cityLocations[j].locationName,
              cost: "",
            });
          }
        }
      }
      replace(combinations);
    }
  }, [selectedCity, cities, replace]);

  const { mutate: updateLocationCost } = useUpdateLocationCost();

  const onSubmit = () => {
    setIsLoading(true);
    const formData = getValues();
    console.log(getValues());

    const payloadforLocationUpdate = {
      city: formData.city,
      locationCostDetails: formData.locationCosts
        .filter((lc) => !lc.isCostReadonly)
        .map((lc) => ({
          pickupLocation: lc.pickup,
          dropLocation: lc.drop,
          cost: Number(lc.cost),
        })),
    };
    const payloadforLocationCost = {
      city: formData.city,
      locationCostDetails: formData.locationCosts.map((lc) => ({
        pickupLocation: lc.pickup,
        dropLocation: lc.drop,
        cost: Number(lc.cost),
      })),
    };

    const dataToSend = isLocationCost
      ? payloadforLocationCost
      : payloadforLocationUpdate;
    if (isEdit && userData?.id) {
      updateLocationCost(
        { id: userData.id, data: dataToSend },
        {
          onSuccess: () => {
            setIsLoading(false);
            onClose();
          },
          onError: () => setIsLoading(false),
        }
      );
    } else {
      createLocationCost(dataToSend, {
        onSuccess: () => {
          setIsLoading(false);
          onClose();
        },
        onError: () => setIsLoading(false),
      });
    }
  };

  const cityOptions = (cities ?? []).map(
    (c: { id: string; cityName: string }) => ({
      label: c.cityName,
      title: c.id,
    })
  );

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      sx={{ zIndex: 999999999 }}
    >
      <Box
        sx={{
          ...styleModalNew,
          width: "90%",
          maxWidth: 900,
          overflowY: "auto",
        }}
      >
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
              ? "Edit Location Cost"
              : isView
              ? "View Location Cost"
              : "Add Location Cost"}
          </Typography>
          <IconButton onClick={onClose} sx={iconStyle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Controller
            name="city"
            control={control}
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <CustomAutocomplete
                label="City"
                required
                placeholder="Select City"
                options={cityOptions}
                control={control}
                name={field.name}
                disabled={isView || isEdit}
                errors={errors}
              />
            )}
          />

          {fields.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
                >
                  <CustomInput
                    name={`locationCosts.${index}.pickup`}
                    label="Pickup"
                    type="text"
                    value={field.pickupLocation}
                    disabled
                  />
                  <CustomInput
                    name={`locationCosts.${index}.dropLocation`}
                    label="Drop"
                    type="text"
                    value={field.dropLocation}
                    disabled
                  />
                  <CustomInput
                    name={`locationCosts.${index}.cost`}
                    label="Cost"
                    type="number"
                    errors={errors}
                    register={register}
                    disabled={
                      isView || (field.isCostReadonly && !isLocationCost)
                    }
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                </Box>
              ))}
            </Box>
          )}

          {!isView && (
            <Box sx={{ ...btnStyleContainer, justifyContent: "end" }}>
              <CustomButton
                type="button"
                variant="outlined"
                label="Cancel"
                onClick={onClose}
                boxSx={{
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border) !important",
                }}
              />
              <CustomButton
                type="submit"
                variant="contained"
                label={isEdit ? "Save Changes" : "Create"}
                loading={isLoading}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default LocationCostModel;
