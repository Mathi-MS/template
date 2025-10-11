import { Box, Typography } from "@mui/material";
import {
  LoginPage,
  LoginPagebottomText,
  LoginPageLeft,
  LoginPageRight,
} from "../assets/Styles/LoginStyle";
import { images } from "../assets/Images/Images";
import { CustomInput } from "../Custom/CustomInput";
import CustomButton from "../Custom/CustomButton";
import { useForm } from "react-hook-form";
import { ForgetPasswordSchema } from "../assets/Validation/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSendResetLink } from "../Hooks/login";
import { useState } from "react";
import { get } from "lodash";

export const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    getValues, 
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ForgetPasswordSchema),
  });
  const navigate = useNavigate();
 const { mutate: sendResetLink, isPending } = useSendResetLink();

 const onsubmit = () => {
  const data = getValues();
   sendResetLink(data.email, {
     onSuccess: () => {
       reset();
     },
   });
 };
  return (
    <>
      <Box sx={{ ...LoginPage }}>
        <Box sx={{ ...LoginPageLeft }}>
          <Typography variant="h2">Forget Password</Typography>
          <Typography component={"p"}>
            Enter your registered email address and we’ll send you a link to
            reset your password.
          </Typography>
          <Box
            component={"form"}
            sx={{ mt: 3 }}
            onSubmit={handleSubmit(onsubmit)}
          >
            <CustomInput
              label="User Id"
              required
              placeholder="Enter your User ID"
              type="text"
              name="email"
              register={register}
              errors={errors}
              boxSx={{ mb: 2 }}
            />
            <CustomButton
              type="submit"
              variant="contained"
              label="Send Reset Link"
              size="large"
              loading={isPending}
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
