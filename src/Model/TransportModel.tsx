import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import CustomButton from "../Custom/CustomButton";
import { CustomInput } from "../Custom/CustomInput";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import { showError } from "../Custom/CustomToast";
import {
  btnStyleContainer,
  iconStyle,
  styleModalNew,
} from "../assets/Styles/CustomModelStyle";
import { transportSchema } from "../assets/Validation/Schema";
import { useTransportCreate, useUpdateTransport } from "../Hooks/transport";
import { useUser } from "../Config/userContext";

const TransportModel = ({ open, onClose, userData, isEdit, isView }: any) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const { user } = useUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      transportId: "",
      vehicleNo: "",
      ownerDetails: "",
      contact: "",
      type: "",
      seater: 0,
      vendor: "",
      email:"",
      vendorName: "",
      city: "",
      cityName: "",
    },
  });

  const createTransport = useTransportCreate();
  const updateTransport = useUpdateTransport();

  useEffect(() => {
    if (open && userData?.id) {
      reset({
        transportId: userData.transportId || "",
        vehicleNo: userData.vehicleNo || "",
        ownerDetails: userData.ownerDetails || "",
        contact: userData.contact || "",
        type: userData.type || "",
        seater: userData.seater || 0,
        vendor: userData.vendorId || "",
        vendorName: user?.user?.account?.vendorName || "",
        city:user?.user?.account?.city?.id||"",
        cityName:user?.user?.account?.city?.cityName||"",
        email:userData.email||"",
      });
    } else {
      reset({
        vendor: user?.user?.account?.id,
        vendorName: user?.user?.account?.vendorName,
        transportId: "",
        vehicleNo: "",
        ownerDetails: "",
        contact: "",
        type: "",
        seater: 0,
        email:"",
        city: user?.user?.account?.city?.id || "",
        cityName: user?.user?.account?.city?.cityName || "",
      });
    }
  }, [open, userData?.id]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async () => {
    const data = getValues();
    try {
      setLoading(true);
      if (isEdit && userData?.id) {
        await updateTransport.mutateAsync({ id: userData.id, data });
      } else {
        await createTransport.mutateAsync(data);
      }
      handleClose();
    } catch (err: any) {
          console.error(err);
          if (err?.errors) {
            Object.keys(err.errors).forEach((field) => {
              setError(field as keyof any, {
                type: "manual",
                message: err.errors[field],
              });
            });
          } else {
            showError("Something went wrong while saving transport");
          }
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
            sx={{
              fontSize: "16px",
              fontFamily: "Medium_M",
              color: "var(--text-primary)",
            }}
          >
            {isEdit
              ? "Edit Transport"
              : isView
              ? "View Transport"
              : "Add New Transport"}
          </Typography>
          <IconButton onClick={handleClose} sx={iconStyle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ m: "5px 0px 20px 0px" }}
        >
          <CustomInput
            label="Transport ID"
            required
            name="transportId"
            placeholder="Enter Transport ID"
            register={register}
            errors={errors}
            disabled={isView || isEdit}
            boxSx={{ mb: 2 }}
          />
          <CustomInput
            label="Vehicle Number"
            required
            name="vehicleNo"
            placeholder="Enter Vehicle Number"
            register={register}
            errors={errors}
            disabled={isView}
            boxSx={{ mb: 2 }}
          />
          <CustomInput
            label="Owner Details"
            required
            name="ownerDetails"
            placeholder="Enter Owner Details"
            register={register}
            errors={errors}
            disabled={isView}
            boxSx={{ mb: 2 }}
          />
          <CustomInput
            label="Contact"
            required
            name="contact"
            placeholder="Enter Contact Number"
            register={register}
            errors={errors}
            disabled={isView}
            boxSx={{ mb: 2 }}
          />
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
          <Box sx={{ mb: 2 }}>
            <CustomAutocomplete
              label="Vehicle Type"
              required
              placeholder="Select Vehicle Type"
              name="type"
              control={control}
              errors={errors}
              options={[
                { label: "SUV", title: "Sport Utility Vehicle" },
                { label: "Sedan", title: "Standard Sedan" },
                { label: "Hatchback", title: "Compact Hatchback" },
                { label: "Convertible", title: "Convertible Car" },
                { label: "Coupe", title: "Two-Door Coupe" },
                { label: "Van", title: "Passenger Van" },
                { label: "Truck", title: "Cargo Truck" },
                { label: "Minivan", title: "Family Minivan" },
                { label: "Pickup", title: "Pickup Truck" },
              ]}
              multiple={false}
              disabled={isView}
            />
          </Box>
          <CustomInput
            label="Seater"
            required
            name="seater"
            type="number"
            placeholder="Enter Seater Capacity"
            register={register}
            errors={errors}
            disabled={isView}
            boxSx={{ mb: 2 }}
          />
          <CustomInput
            label="Vendor"
            required
            name="vendorName"
            type="text"
            placeholder="Enter Vendor Name"
            register={register}
            errors={errors}
            disabled
            boxSx={{ mb: 2 }}
          />
          <CustomInput
            label="City"
            required
            name="cityName"
            type="text"
            placeholder="Enter City Name"
            register={register}
            errors={errors}
            disabled
            boxSx={{ mb: 2 }}
          />
        </Box>

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
              // onClick={() => {
              //   console.log(getValues());
                
              //   handleSubmit(onSubmit);
              // }}
              onClick={handleSubmit(onSubmit)}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default TransportModel;
