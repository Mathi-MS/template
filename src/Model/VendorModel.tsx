import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import CustomButton from "../Custom/CustomButton";
import { CustomInput } from "../Custom/CustomInput";
import { showError } from "../Custom/CustomToast";
import {
  btnStyleContainer,
  iconStyle,
  styleModalNew,
} from "../assets/Styles/CustomModelStyle";
import { vendorSchema } from "../assets/Validation/Schema";
import { useGetCities } from "../Hooks/city";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import type { CityFormData } from "./CityModel";
import { useUpdateVendor, useVendorCreate } from "../Hooks/vendor";

export interface VendorFormData {
  id?: string;
  vendorId: string;
  vendorName: string;
  city: string;
  address: string;
  email: string;
  mobile: string;
}

const VendorModel = ({ open, onClose, userData, isEdit, isView }: any) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { data: cities } = useGetCities();
  const cityOptions = (cities ?? []).map((d: CityFormData) => {
    return { label: d.cityName, title: d.id };
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendorId: "",
      vendorName: "",
      city: "",
      address: "",
      email: "",
      mobile: "",
    },
  });

  const createVendorMutation = useVendorCreate();
  const updateVendorMutation = useUpdateVendor();

  useEffect(() => {
    if (open && userData?.id) {
      reset({
        vendorId: userData.vendorId || "",
        vendorName: userData.vendorName || "",
        city: userData.cityId || "",
        address: userData.address || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
      });
    }
  }, [open, userData?.id]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: VendorFormData) => {
    try {
      setLoading(true);
      if (isEdit && userData?.id) {
        await updateVendorMutation.mutateAsync({ id: userData.id, data });
      } else {
        await createVendorMutation.mutateAsync(data);
      }
      handleClose();
    } catch (err) {
      console.error(err);
      showError("Something went wrong while saving vendor");
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
            {isEdit ? "Edit Vendor" : isView ? "View Vendor" : "Add New Vendor"}
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
            label="Vendor ID"
            required
            placeholder="Enter Vendor ID"
            type="text"
            name="vendorId"
            register={register}
            errors={errors}
            disabled={isView || isEdit}
            boxSx={{ mb: 2 }}
          />
          <CustomInput
            label="Vendor Name"
            required
            placeholder="Enter Vendor Name"
            type="text"
            name="vendorName"
            register={register}
            errors={errors}
            disabled={isView}
            boxSx={{ mb: 2 }}
          />
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
            label="Address"
            required
            placeholder="Enter Address"
            type="text"
            name="address"
            register={register}
            errors={errors}
            disabled={isView}
            boxSx={{ mb: 2 }}
          />
          <CustomInput
            label="Email"
            required
            placeholder="Enter Email"
            type="email"
            name="email"
            register={register}
            errors={errors}
            disabled={isView}
            boxSx={{ mb: 2 }}
          />
          <CustomInput
            label="Mobile"
            required
            placeholder="Enter Mobile Number"
            type="text"
            name="mobile"
            register={register}
            errors={errors}
            disabled={isView}
            boxSx={{ mb: 2 }}
          />
        </Box>
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
              onClick={handleSubmit(onSubmit)}
              label={isEdit ? "Save Changes" : "Create"}
              loading={isLoading}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default VendorModel;
