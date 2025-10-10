import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../Custom/CustomButton";
import { CustomInput } from "../Custom/CustomInput";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../Custom/CustomToast";
import {
  btnStyleContainer,
  iconStyle,
  styleModalNew,
} from "../assets/Styles/CustomModelStyle";
import { citySchema } from "../assets/Validation/Schema";
import { useCityCreate, useUpdateCity } from "../Hooks/city";

export interface CityFormData {
  id?: string;
  cityId: string;
  cityName: string;
}

const CityModel = ({ open, onClose, userData, isEdit, isView }: any) => {
  const [isloading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
  });

  const createCityMutation = useCityCreate();
  const updateCityMutation = useUpdateCity();

useEffect(() => {
  if (open) {
    if (userData?.id) {
      reset({
        cityId: userData.cityId || "",
        cityName: userData.cityName || "",
      });
    } else {
      reset({
        cityId: "",
        cityName: "",
      });
    }
  }
}, [open, userData]);


  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CityFormData) => {
    try {
      setLoading(true);

      if (isEdit && userData?.id) {
        await updateCityMutation.mutateAsync({ id: userData.id, data });
      } else {
        await createCityMutation.mutateAsync(data);
      }
      handleClose();
    } catch (err: any) {
      console.error(err);
      if (err?.errors) {
        Object.keys(err.errors).forEach((field) => {
          setError(field as keyof CityFormData, {
            type: "manual",
            message: err.errors[field],
          });
        });
      } else {
        showError("Something went wrong while saving city");
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
            component="h2"
            sx={{
              fontSize: "16px",
              fontFamily: "Medium_M",
              color: "var(--text-primary)",
            }}
          >
            {isEdit ? "Edit City" : isView ? "View City" : "Add New City"}
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
            label="City ID"
            required
            placeholder="Enter your City ID"
            type="text"
            name="cityId"
            register={register}
            errors={errors}
            disabled={isView || isEdit} // optionally disable editing cityId
            boxSx={{ mb: 2 }}
          />
          <CustomInput
            label="City Name"
            required
            placeholder="Enter your City Name"
            type="text"
            name="cityName"
            disabled={isView}
            register={register}
            errors={errors}
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
              loading={isloading}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CityModel;
