import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../Custom/CustomButton";
import { CustomInput } from "../Custom/CustomInput";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../Custom/CustomToast";
import {
  btnStyleContainer,
  iconStyle,
  styleModalNew,
} from "../assets/Styles/CustomModelStyle";
import { locationSchema } from "../assets/Validation/Schema";

const LocationModel = ({ open, onClose, userData, isEdit, isView }: any) => {
  const [isloading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(locationSchema),
  });

  const cityOptions = [
    { title: "Chennai", label: "Chennai" },
    { title: "Bengaluru", label: "Bengaluru" },
    { title: "Hyderabad", label: "Hyderabad" },
    { title: "Mumbai", label: "Mumbai" },
    { title: "Delhi", label: "Delhi" },
    { title: "Kolkata", label: "Kolkata" },
    { title: "Pune", label: "Pune" },
    { title: "Coimbatore", label: "Coimbatore" },
    { title: "Jaipur", label: "Jaipur" },
    { title: "Ahmedabad", label: "Ahmedabad" },
  ];

  const onsubmit = (data: {
    locationId: string;
    locationName: string;
    cityName: string;
  }) => {
    console.log(data);
  };
  const handleClose = () => {
    reset();
    onClose();
    // setLoading(false);
  };

  //   useEffect(() => {
  //     if (isEdit && userData) {
  //       reset({
  //         locationId: userData.locationId,
  //         locationName: userData.location,
  //         cityName: userData.city,
  //       });
  //     } else {
  //       reset({
  //         locationId: "",
  //         locationName: "",
  //         cityName: "",
  //       });
  //     }
  //   }, [userData, isEdit, reset]);
  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ zIndex: "999999999" }}
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
                id="modal-modal-title"
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
              component={"form"}
              onSubmit={handleSubmit(onsubmit)}
              sx={{ m: "5px 0px 20px 0px" }}
            >
              <Box sx={{ mb: 2 }}>
                <CustomAutocomplete
                  label="City"
                  required
                  placeholder="Select your City"
                  name="cityName"
                  control={control}
                  errors={errors}
                  options={cityOptions}
                  multiple={false}
                />
              </Box>
              <CustomInput
                label="Location ID"
                required
                placeholder="Enter your Location ID"
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
                placeholder="Enter your Location Name"
                type="text"
                name="locationName"
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
                    border: " 1px solid var(--border) !important",
                  }}
                  onClick={() => handleClose()}
                />
                <CustomButton
                  type="submit"
                  variant="contained"
                  size="medium"
                  label={isEdit ? "Save Changes" : "Create"}
                  onClick={handleSubmit(onsubmit)}
                  loading={isloading}
                />
              </Box>
            )}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default LocationModel;
