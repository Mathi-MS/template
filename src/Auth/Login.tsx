import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import {
  LoginPage,
  LoginPagebottomText,
  LoginPageLeft,
  LoginPageRight,
} from "../assets/Styles/LoginStyle";
import { images } from "../assets/Images/Images";
import { CustomInput } from "../Custom/CustomInput";
import { useEffect, useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CustomButton from "../Custom/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { LoginSchema } from "../assets/Validation/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "../Config/userContext";
import { useLoginApi } from "../Hooks/login";
import type { ApiResponse } from "../Interface/Custom";
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
  const { login } = useUser();
  const navigate = useNavigate();
  const loginMutation = useLoginApi();

  useEffect(() => {
    const savedUserId = Cookies.get("userId");
    const savedPassword = Cookies.get("password");

    if (savedUserId && savedPassword) {
      reset({
        email: savedUserId,
        password: savedPassword,
        rememberMe: true,
      });
    }
  }, [reset]);

  const onsubmit = async (data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    try {
      const dataToSend = {
        userId: data.email,
        password: data.password,
      };
      const response = await loginMutation.mutateAsync(dataToSend);
      const storedData = {
        user: {
          userId:
            response?.account?.userId ||
            response?.account?.vendorId ||
            response?.account?.transportId,
          username:
            response?.account?.username ||
            response?.account?.vendorName ||
            response?.account?.ownerDetails,
          mobileNo:
            response?.account?.mobileNo ||
            response?.account?.mobile ||
            response?.account?.contact,
          email: response?.account?.email,
          role: response?.account?.role,
          account: response?.account,
        },
        token: response.token,
      };
      login(storedData);
      if (data.rememberMe) {
        Cookies.set("userId", data.email);
        Cookies.set("password", data.password);
      }
      if (response?.account?.role === "admin") {
        navigate("/dashboard");
      } else if (response?.account?.role === "user") {
        navigate("/ride");
      }
      reset();
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  return (
    <>
      <Box sx={{ ...LoginPage }}>
        <Box sx={{ ...LoginPageLeft }}>
          <Typography variant="h2">Sign In</Typography>
          <Typography component={"p"}>
            Enter your User-ID and password to sign in!
          </Typography>
          <Box
            component={"form"}
            sx={{ mt: 3 }}
            onSubmit={handleSubmit(onsubmit)}
          >
            <CustomInput
              label="User ID"
              required
              placeholder="Enter your User ID"
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
              boxSx={{
                "& .MuiInputAdornment-root": {
                  margin: "0px",
                  "& .MuiSvgIcon-root": {
                    fontSize: "16px",
                    color: "var(--customIcon)",
                    marginTop: "8px",
                  },
                },
              }}
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
