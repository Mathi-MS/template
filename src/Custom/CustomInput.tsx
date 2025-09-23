import { Box, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import get from "lodash/get";
import { CustomInputStyles, labelStyle } from "../assets/Styles/CustomStyles";
import type { CustomInputProps } from "../Interface/Custom";

export const CustomInput = ({
  label,
  required,
  placeholder,
  type,
  name,
  disabled,
  startAdornment,
  endAdornment,
  register,
  helperText,
  errors,
  value,
  boxSx,
}: CustomInputProps) => {
  const errorMessage = get(errors, `${name}.message`, null);
  return (
    <>
      <Box
        sx={{
          ...CustomInputStyles,
          ...boxSx,
        }}
      >
        <Tooltip title={label} arrow>
          <Typography sx={{...labelStyle}} component={"span"}>
            {label.length > 20 ? label.slice(0, 20) + "..." : label}
          </Typography>
        </Tooltip>
        {required && <Box component={"span"} color={"var(--error)"}>*</Box>}

        <TextField
          placeholder={placeholder}
          // focused
          color="primary"
          name={name}
          value={value}
          type={type}
          disabled={disabled}
          {...(register && register(name))}
          error={errorMessage ? true : false}
          helperText={errorMessage ? errorMessage.toString() : helperText}
          slotProps={{
            input: {
              startAdornment: startAdornment ? (
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              ) : undefined,
              endAdornment: endAdornment ? (
                <InputAdornment position="start">{endAdornment}</InputAdornment>
              ) : undefined,
            },
          }}
        />
      </Box>
    </>
  );
};
