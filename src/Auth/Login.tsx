import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
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
import { useForm, Controller } from "react-hook-form";
import { LoginSchema } from "../assets/Validation/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export const Login = () => {
  const [visibility, setVisibility] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { rememberMe: false },
  });
  const navigate = useNavigate();
  const onsubmit = async (data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    console.log(data);
    navigate("/dashboard");
    reset();
    Cookies.set("tokenBoiler", "token");
    Cookies.set("role", "SuperAdmin");
    Cookies.set("name", "Gopal");
  };
  return (
    <>
      <Box sx={{ ...LoginPage }}>
        <Box sx={{ ...LoginPageLeft }}>
          <Typography variant="h2">Sign In</Typography>
          <Typography component={"p"}>
            Enter your email and password to sign in!
          </Typography>
          <Box
            component={"form"}
            sx={{ mt: 3 }}
            onSubmit={handleSubmit(onsubmit)}
          >
            <CustomInput
              label="Email"
              required
              placeholder="Enter your email"
              type="text"
              name="email"
              register={register}
              errors={errors}
              boxSx={{ mb: 2 }}
            />
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
            />
            <Box
              sx={{
                my: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Controller
                name="rememberMe"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <FormControlLabel
                    inputRef={ref}
                    control={
                      <Checkbox
                        checked={Boolean(value)}
                        onChange={(_, checked) => onChange(checked)}
                        size="small"
                      />
                    }
                    label="Keep me signed in"
                    sx={{
                      color: "var(--text-secondary)",
                      ".MuiFormControlLabel-label": {
                        color: "var(--text-secondary)",
                        fontSize: "14px",
                        fontFamily: "Regular_M",
                      },
                      "& svg": {
                        color: "var(--primary)",
                      },
                    }}
                  />
                )}
              />
              <Box
                component={"span"}
                sx={{
                  color: "var(--primary)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/forget-password");
                }}
              >
                Forgot Password?
              </Box>
            </Box>
            <CustomButton
              type="submit"
              variant="contained"
              label="Sign in"
              size="large"
            />
          </Box>
          <Typography sx={{ ...LoginPagebottomText }}>
            Don't have an account?
            <Box component={"span"}> Sign Up</Box>
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
