import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import CustomButton from "../Custom/CustomButton";
import { CustomInput } from "../Custom/CustomInput";
import { showError, showSuccess } from "../Custom/CustomToast";
import {
  styleModalNew,
  iconStyle,
  btnStyleContainer,
} from "../assets/Styles/CustomModelStyle";
import { z } from "zod";
import { useSendOtp, useVerifyOtp } from "../Hooks/ticket";
import dayjs from "dayjs";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";

// Zod schema for Ticket Form
const ticketSchema = z.object({
  cityName: z.string().min(1, "City is required"),
  pickupLocation: z.string().min(1, "Pickup Location is required"),
  dropLocation: z.string().optional(),
  otp: z.string().min(1, "OTP is required"),
});

export interface TicketFormData {
  cityName: string;
  pickupLocation: string;
  dropLocation?: string;
  otp: string;
}

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  userData: any;
}

const TicketModal = ({ open, onClose, userData }: TicketModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(userData?.otpSent || false);
  const [otpExpiryTime, setOtpExpiryTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

useEffect(() => {
  if (!otpExpiryTime) return;

  const interval = setInterval(() => {
    const diff = dayjs(otpExpiryTime).diff(dayjs(), "second");
    setTimeLeft(diff > 0 ? diff : 0);
  }, 1000);

  return () => clearInterval(interval);
}, [otpExpiryTime]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      cityName: userData?.city?.cityName || "",
      pickupLocation: userData?.pickupLocation?.locationName || "",
      otp: "",
      dropLocation: userData?.dropLocation?.locationName || "",
    },
  });

  console.log(userData);
  

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  useEffect(() => {
    if (open && userData) {
      reset({
        cityName: userData?.city?.cityName || "",
        pickupLocation: userData?.pickupLocation?.locationName || "",
        dropLocation: userData?.dropLocation?.locationName || "",
        otp: userData?.otp || "",
      });
      setOtpSent(userData?.otpSent || false);
    }
  }, [open, userData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const locationOptions =
    userData?.city?.locations?.map((loc: any) => ({
      label: loc.locationName,
      title: loc.id,
    })) || [];

const handleSendOtp = async () => {
  if (!userData?.id) return;
  setOtpLoading(true);
  try {
    const response = await sendOtpMutation.mutateAsync(userData.id);
    showSuccess("OTP sent successfully");
    setOtpSent(true);
    const expiry = dayjs().add(5, "minute").toDate();
    setOtpExpiryTime(expiry);
  } catch (err: any) {
    showError(err?.message || "Failed to send OTP");
  } finally {
    setOtpLoading(false);
  }
};


  const onSubmit = async (data: TicketFormData) => {
    try {
      setIsLoading(true);

      if (!otpSent) {
        showError("Please get OTP first");
        return;
      }

      await verifyOtpMutation.mutateAsync({ id: userData.id, otp: data.otp });
      showSuccess("Ticket verified successfully");
      handleClose();
    } catch (err: any) {
      showError(err?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        handleClose();
      }}
    >
      <Box sx={styleModalNew}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: "Medium_M", fontSize: "16px" }}
          >
            Ticket Details
          </Typography>
          <IconButton onClick={handleClose} sx={iconStyle}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <CustomInput
            label="City"
            required
            placeholder="Enter City"
            type="text"
            name="cityName"
            register={register}
            errors={errors}
            disabled
            boxSx={{ mb: 2 }}
          />

          <CustomInput
            label="Pickup Location"
            required
            placeholder="Enter Pickup Location"
            type="text"
            name="pickupLocation"
            register={register}
            errors={errors}
            disabled
            boxSx={{ mb: 2 }}
          />

          {userData?.dropLocation && (
            <CustomInput
              label="Drop Location"
              required
              placeholder="Enter Drop Location"
              type="text"
              name="dropLocation"
              register={register}
              errors={errors}
              disabled
              boxSx={{ mb: 2 }}
            />
          )}

          {/* OTP input with button */}
          {userData?.status?.toLowerCase() === "pending" && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <CustomInput
                label="OTP"
                required
                placeholder="Enter OTP"
                type="text"
                name="otp"
                register={register}
                errors={errors}
                disabled={!otpSent}
                boxSx={{ mb: 2 }}
              />
              {
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <CustomButton
                    type="button"
                    variant="contained"
                    label={otpSent ? "Resend OTP" : "Get OTP"}
                    onClick={handleSendOtp}
                    loading={otpLoading}
                    disabled={timeLeft > 0}
                  />
                  {timeLeft > 0 && (
                    <Typography
                      sx={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      OTP expires in: {formatTime(timeLeft)}
                    </Typography>
                  )}
                </Box>
              }
            </Box>
          )}

          {/* Buttons */}
        </Box>
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
          {userData?.status?.toLowerCase() === "pending" && (
            <CustomButton
              type="submit"
              variant="contained"
              size="medium"
              label={"Verify Otp"}
              onClick={handleSubmit(onSubmit)}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default TicketModal;
