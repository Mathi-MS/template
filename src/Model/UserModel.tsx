import {
  Box,
  IconButton,
  Modal,
  TextField,
  Typography,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { CustomInput } from "../Custom/CustomInput";
import CustomButton from "../Custom/CustomButton";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import { showError } from "../Custom/CustomToast";
import {
  btnStyleContainer,
  iconStyle,
  styleModalNew,
} from "../assets/Styles/CustomModelStyle";
import { userSchema } from "../assets/Validation/Schema";
import {
  useUserCreate,
  useUpdateUser,
  useGetTransportsByLocation,
} from "../Hooks/user";
import { useGetCities } from "../Hooks/city";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export interface UserFormData {
  id?: string;
  userId: string;
  username: string;
  address: string;
  mobileNo: string;
  cityId: string;
  pickupLocation: string;
  transport: string;
  noOfPerson: number;
  email: string;
  pickupDate: any;
}

const UserModel = ({ open, onClose, userData, isEdit, isView }: any) => {
  const [isLoading, setLoading] = useState(false);
  const { data: cities } = useGetCities();

  const cityOptions =
    (cities ?? []).map((c: any) => ({
      label: c.cityName,
      title: c.id,
    })) ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userId: "",
      username: "",
      address: "",
      mobileNo: "",
      cityId: "",
      pickupLocation: "",
      transport: "",
      noOfPerson: 0,
      email: "",
      pickupDate: null,
    },
  });

  const selectedCity = watch("cityId");
  const noOfPerson = watch("noOfPerson");
  const selectedCityData = (cities ?? []).find(
    (c: any) => c.id === selectedCity
  );

  const locationOptions =
    selectedCityData?.locations?.map((l: any) => ({
      label: l.locationName,
      title: l.id,
    })) ?? [];

  const { data: transports } = useGetTransportsByLocation(
    typeof selectedCity === "string" ? selectedCity : undefined,
    noOfPerson && noOfPerson > 0 ? noOfPerson : undefined
  );

  const transportOptions =
    (transports ?? []).map((t: any) => ({
      label: `${t.type}`,
      title: t.id,
    })) ?? [];

  const createUser = useUserCreate();
  const updateUser = useUpdateUser();

  useEffect(() => {
    if (open && userData?.id) {
      console.log(userData);
      
      reset({
        userId: userData.userId || "",
        username: userData.username || "",
        address: userData.address || "",
        mobileNo: userData.mobileNo || "",
        cityId: userData.city?.id || "",
        pickupLocation: userData.pickupLocation?.id || "",
        transport: userData.transport?.id || "",
        noOfPerson: userData.noOfPerson.tostring() || 0,
        email: userData.email || "",
        pickupDate: userData.pickupDate ? dayjs(userData.pickupDate) : null,
      });
    } else {
      reset({
        userId: "",
        username: "",
        address: "",
        mobileNo: "",
        cityId: "",
        pickupLocation: "",
        transport: "",
        noOfPerson: 0,
        email: "",
        pickupDate: null,
      });
    }
  }, [open, userData?.id, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async () => {
    const data = getValues();
    const formattedData = {
      ...data,
      role: "user", 
      pickupDate: data.pickupDate
        ? dayjs(data.pickupDate).format("YYYY-MM-DD")
        : null,
    };

    try {
      setLoading(true);
      if (isEdit && userData?.id) {
        await updateUser.mutateAsync({ id: userData.id, data: formattedData });
      } else {
        await createUser.mutateAsync(formattedData);
      }
      handleClose();
    } catch (err) {
      console.error(err);
      showError("Something went wrong while saving user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => reason !== "backdropClick" && handleClose()}
      sx={{ zIndex: 999999 }}
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
            sx={{
              fontSize: "16px",
              fontFamily: "Medium_M",
              color: "var(--text-primary)",
            }}
          >
            {isEdit ? "Edit User" : isView ? "View User" : "Add New User"}
          </Typography>
          <IconButton onClick={handleClose} sx={iconStyle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ m: "5px 0px 20px 0px" }}
          >
            {/* Inputs */}
            <CustomInput
              label="User ID"
              required
              name="userId"
              placeholder="Enter User ID"
              register={register}
              errors={errors}
              disabled={isView || isEdit}
              boxSx={{ mb: 2 }}
            />
            <CustomInput
              label="Username"
              required
              name="username"
              placeholder="Enter Username"
              register={register}
              errors={errors}
              disabled={isView}
              boxSx={{ mb: 2 }}
            />
            <CustomInput
              label="Address"
              required
              name="address"
              placeholder="Enter Address"
              register={register}
              errors={errors}
              disabled={isView}
              boxSx={{ mb: 2 }}
            />
            <CustomInput
              label="Mobile Number"
              required
              name="mobileNo"
              placeholder="Enter Mobile Number"
              register={register}
              errors={errors}
              disabled={isView}
              boxSx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Tooltip title="Pickup Date" arrow>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Medium_M",
                    color: "var(--text-primary)",
                    mb: "6px",
                    display: "inline-block",
                  }}
                  component={"span"}
                >
                  {"Pickup Date".length > 20
                    ? "Pickup Date".slice(0, 20) + "..."
                    : "Pickup Date"}
                </Typography>
              </Tooltip>
              <Box component={"span"} color={"var(--error)"}>
                *
              </Box>
              <Controller
                name="pickupDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        variant: "outlined",
                        disabled: isView,
                        error: !!errors.pickupDate,
                        helperText: errors.pickupDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* ✅ City */}
            <Box sx={{ mb: 2 }}>
            <CustomAutocomplete
              label="City"
              required
              placeholder="Select City"
              name="cityId"
              control={control}
              errors={errors}
              options={cityOptions}
              multiple={false}
              disabled={isView}
            />
            </Box>

            {/* ✅ Pickup Location */}
            <Box sx={{ mb: 2 }}>
            <CustomAutocomplete
              label="Pickup Location"
              required
              placeholder="Select Pickup Location"
              name="pickupLocation"
              control={control}
              errors={errors}
              options={locationOptions}
              multiple={false}
              disabled={isView || !selectedCity}
            />
            </Box>
            <CustomInput
              label="No. of Persons"
              required
              name="noOfPerson"
              type="number"
              placeholder="Enter Number of Persons"
              register={register}
              errors={errors}
              disabled={isView}
              boxSx={{ mb: 2 }}
            />

            {/* ✅ Transport */}
            <Box sx={{ mb: 2 }}>
            <CustomAutocomplete
              label="Transport"
              required
              placeholder="Select Transport"
              name="transport"
              control={control}
              errors={errors}
              options={transportOptions}
              multiple={false}
              disabled={isView || !selectedCity}
              boxSx={{ mb: 2 }}
            />
            </Box>

            {/* ✅ No. of Persons */}

            {/* ✅ Email */}
            <CustomInput
              label="Email"
              required
              name="email"
              type="email"
              placeholder="Enter Email"
              register={register}
              errors={errors}
              disabled={isView}
              boxSx={{ mb: 2 }}
            />
          </Box>
        </LocalizationProvider>

        {!isView && (
          <Box sx={{ ...btnStyleContainer, justifyContent: "end" }}>
            <CustomButton
              type="button"
              variant="outlined"
              label="Cancel"
              onClick={handleClose}
              boxSx={{
                backgroundColor: "transparent",
                color: "var(--text-secondary)",
                border: "1px solid var(--border) !important",
              }}
            />
            <CustomButton
              type="submit"
              variant="contained"
              size="medium"
              label={isEdit ? "Save Changes" : "Create"}
              loading={isLoading}
              onClick={() => {
                handleSubmit(onSubmit)();
                console.log(getValues());
                console.log(errors);
              }}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default UserModel;
