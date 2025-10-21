import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { CustomInput } from "../Custom/CustomInput";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import CustomButton from "../Custom/CustomButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { btnStyleContainer } from "../assets/Styles/CustomModelStyle";
import { useState, useMemo, useEffect } from "react";
import { useUser } from "../Config/userContext";
import { useCreateRideTicket, useGetMyTickets } from "../Hooks/ticket";
import { showError, showSuccess } from "../Custom/CustomToast";

const CreateRide = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [hideDrop, setHideDrop] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { data } = useGetMyTickets();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      city: user?.user?.account?.city?.id || "",
      cityName: user?.user?.account?.city?.cityName || "",
      pickupLocation: "",
      dropLocation: "",
      vehicle: `${user?.user?.account?.transport?.type || ""}`,
      transport: user?.user?.account?.transport?.id || "",
    },
  });

  const allLocationOptions = useMemo(() => {
    return (
      user?.user?.account?.city?.locations?.map((loc) => ({
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
    return allLocationOptions.filter((loc) => loc.title !== pickupLocation);
  }, [pickupLocation, allLocationOptions]);

  // 🟢 Handle single-ticket admin/superadmin logic
  useEffect(() => {
    if (data && data.length === 1) {
      const ticket = data[0];
      const isAdmin =
        ticket.createdRole?.toLowerCase() === "admin" ||
        ticket.createdRole?.toLowerCase() === "superadmin";
      const isCompleted = ticket.status?.toLowerCase() === "completed"; // 🟢 NEW condition

      // 🟢 If completed, show normal form (pickup/drop visible & editable)
      if (isCompleted) {
        setHideDrop(false);
        setIsDisabled(false);
        return;
      }

      // 🟠 If admin/superadmin and not completed
      if (isAdmin) {
        if (ticket?.pickupLocation) {
          setValue("pickupLocation", ticket.pickupLocation?.id);
        }
        setHideDrop(true);
      } else {
        setHideDrop(false);
      }
    } else {
      setHideDrop(false);
    }
  }, [data, setValue]);

  const { mutateAsync: createRideTicket } = useCreateRideTicket();

  const onSubmit = async () => {
    const formData = getValues();

    // 🟢 Handle single-ticket cases
    if (data?.length === 1) {
      const ticket = data[0];
      const isAdmin =
        ticket.createdRole?.toLowerCase() === "admin" ||
        ticket.createdRole?.toLowerCase() === "superadmin";
      if (isAdmin) {
        showSuccess("You successfully created your ride.");
        setIsDisabled(true);
        return;
      }
    }

    try {
      setIsLoading(true);
      await createRideTicket(formData);
    } catch (err) {
      if (err?.errors) {
        Object.keys(err.errors).forEach((field) => {
          setError(field, {
            type: "manual",
            message: err.errors[field],
          });
        });
      } else {
        showError(err?.message);
      }
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
      <Box sx={{ alignSelf: "flex-end", mb: 2 }}>
        <Tooltip title="Need help? Contact support.">
          <IconButton sx={{ color: "var(--text-secondary)" }}>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

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
            disabled={
              data &&
              data.length === 1 &&
              data[0].status?.toLowerCase() !== "completed"
            }
          />
        </Box>

        {!hideDrop && (
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
        )}

        <Box sx={{ ...btnStyleContainer, justifyContent: "center", mt: 3 }}>
          <CustomButton
            type="submit"
            variant="contained"
            size="medium"
            label="Confirm Ride"
            loading={isLoading}
            disabled={(() => {
              if (isDisabled) return true;
              if (!data || data.length === 0) return false;
              const status = data[0]?.status?.toLowerCase();
              if (status === "pending" || status === "completed") return false;
              if (status === "ride started") return true;
              return false;
            })()}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CreateRide;
