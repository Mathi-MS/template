import { Box, Typography, } from "@mui/material";
import {
  LoginPage,
  LoginPagebottomText,
  LoginPageLeft,
  LoginPageRight,
} from "../assets/Styles/LoginStyle";
import { images } from "../assets/Images/Images";
import { CustomInput } from "../Custom/CustomInput";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CustomButton from "../Custom/CustomButton";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema } from "../assets/Validation/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const [visibility, setVisibility] = useState(false);
  const [visibilityConfirm, setVisibilityConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const navigate = useNavigate();
  const onsubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    console.log(data);
    navigate("/login");
    reset();
  };
  return (
    <>
      <Box sx={{ ...LoginPage }}>
        <Box sx={{ ...LoginPageLeft }}>
          <Typography variant="h2">Reset Password</Typography>
          <Typography component={"p"}>
            Enter your new password below to reset your account access.
          </Typography>
          <Box
            component={"form"}
            sx={{ mt: 3 }}
            onSubmit={handleSubmit(onsubmit)}
          >
            <CustomInput
              label="Password"
              required
              placeholder="Enter your password"
              type={visibility ? "text" : "password"}
              name="password"
              endAdornment={
                visibility ? (
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => setVisibility(!visibility)}
                  >
                    <VisibilityOutlinedIcon />
                  </Box>
                ) : (
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => setVisibility(!visibility)}
                  >
                    <VisibilityOffOutlinedIcon />
                  </Box>
                )
              }
              register={register}
              errors={errors}
              boxSx={{ mb: 2 }}
            />
            <CustomInput
              label="Confirm Password"
              required
              placeholder="Confirm Password"
              type={visibilityConfirm ? "text" : "password"}
              name="confirmPassword"
              endAdornment={
                visibilityConfirm ? (
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => setVisibilityConfirm(!visibilityConfirm)}
                  >
                    <VisibilityOutlinedIcon />
                  </Box>
                ) : (
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => setVisibilityConfirm(!visibilityConfirm)}
                  >
                    <VisibilityOffOutlinedIcon />
                  </Box>
                )
              }
              register={register}
              errors={errors}
              boxSx={{ mb: 2 }}
            />
            <CustomButton
              type="submit"
              variant="contained"
              label="Reset Password"
              size="large"
            />
          </Box>
          <Typography sx={{ ...LoginPagebottomText }}>
            Take me back to..
            <Box
              component={"span"}
              onClick={() => {
                navigate("/login");
              }}
            >
              {" "}
              Login
            </Box>
          </Typography>
        </Box>
        <Box sx={{ ...LoginPageRight }}>
          <Box
            component={"img"}
            src={images.loginLeft}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </Box>
      </Box>
    </>
  );
};
