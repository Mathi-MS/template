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

const CityModel = ({ open, onClose, userData, isEdit, isView }: any) => {
  const [isloading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(citySchema),
  });

  const onsubmit = (data: { cityId: string; cityName: string }) => {
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
  //         cityId: userData.cityId,
  //         cityName: userData.city,
  //       });
  //     } else {
  //       reset({
  //         cityId: "",
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
                {isEdit ? "Edit City" : isView ? "View City" : "Add New City"}
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
              <CustomInput
                label="City ID"
                required
                placeholder="Enter your City ID"
                type="text"
                name="cityId"
                register={register}
                errors={errors}
                disabled={isView}
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

export default CityModel;
