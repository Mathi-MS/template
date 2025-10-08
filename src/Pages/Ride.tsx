import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { CustomInput } from "../Custom/CustomInput";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import CustomButton from "../Custom/CustomButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { btnStyleContainer } from "../assets/Styles/CustomModelStyle";
import { useState, useMemo } from "react";
import { useUser } from "../Config/userContext";
import { useCreateRideTicket } from "../Hooks/ticket";
import { showError } from "../Custom/CustomToast";

export const CreateRide = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      city: user?.user?.account?.city?.id || "",
      cityName: user?.user?.account?.city?.cityName || "",
      pickupLocation: "",
      dropLocation: "",
      vehicle:
        `${user?.user?.account?.transport?.transportId} - ${user?.user?.account?.transport?.vehicleNo}` ||
        "",
      transport: user?.user?.account?.transport?.id || "",
    },
  });
  const allLocationOptions = useMemo(() => {
    return (
      user?.user?.account?.city?.locations?.map((loc: any) => ({
        label: loc.locationName,
        title: loc.id,
      })) || []
    );
  }, [user]);
  const pickupLocation = useWatch({
    control,
    name: "pickupLocation",
  });
  const filteredDropOptions = useMemo(() => {
    if (!pickupLocation) return allLocationOptions;
    return allLocationOptions.filter(
      (loc: any) => loc.title !== pickupLocation
    );
  }, [pickupLocation, allLocationOptions]);

const { mutateAsync: createRideTicket } = useCreateRideTicket();
const onSubmit = async (data: any) => {
  try {
    setIsLoading(true);
    await createRideTicket(data);
  } catch (err: any) {
    if (err?.errors) {
      Object.keys(err.errors).forEach((field) => {
        setError(field as keyof typeof data, {
          type: "manual",
          message: err.errors[field],
        });
      });
    } else {
      showError(err?.message);
    }
    showError(err?.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 5,
        px: 2,
      }}
    >
      {/* 🆘 Help Icon */}
      <Box sx={{ alignSelf: "flex-end", mb: 2 }}>
        <Tooltip title="Need help? Contact support.">
          <IconButton sx={{ color: "var(--text-secondary)" }}>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 🏍 Header */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Medium_M",
          color: "var(--text-primary)",
          mb: 3,
          textAlign: "center",
        }}
      >
        Book Your Ride 🚕
      </Typography>

      {/* 📝 Form */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: "var(--card-bg)",
          p: 3,
          borderRadius: 3,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* City (autofetched) */}
        <CustomInput
          label="City"
          required
          placeholder="City"
          type="text"
          name="cityName"
          register={register}
          errors={errors}
          disabled
        />

        {/* Transport (autofetched) */}
        <CustomInput
          label="Transport"
          required
          placeholder="Your Vehicle"
          type="text"
          name="vehicle"
          register={register}
          errors={errors}
          disabled
          boxSx={{ mt: 2 }}
        />

        {/* Pickup */}
        <Box sx={{ mt: 2 }}>
          <CustomAutocomplete
            label="Pickup Location"
            required
            placeholder="Select Pickup"
            name="pickupLocation"
            control={control}
            errors={errors}
            options={allLocationOptions}
            multiple={false}
          />
        </Box>

        {/* Drop (filtered) */}
        <Box sx={{ mt: 2 }}>
          <CustomAutocomplete
            label="Drop Location"
            required
            placeholder="Select Drop"
            name="dropLocation"
            control={control}
            errors={errors}
            options={filteredDropOptions}
            multiple={false}
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ ...btnStyleContainer, justifyContent: "center", mt: 3 }}>
          <CustomButton
            type="submit"
            variant="contained"
            size="medium"
            label="Confirm Ride"
            loading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};
