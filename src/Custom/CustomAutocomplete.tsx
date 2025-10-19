import { Autocomplete, Box, TextField, Tooltip, Typography } from "@mui/material";
import {
  CustomAutocompleteStyles,
  CustomInputStyles,
  labelStyle,
} from "../assets/Styles/CustomStyles";
import get from "lodash/get";
import { Controller } from "react-hook-form";

export type AutoOption = {
  title: string;
  label: string;
};

export const CustomAutocomplete = ({
  label,
  required,
  limitTags,
  multiple,
  options,
  placeholder,
  name,
  errors,
  control,
  helperText,
  disabled, 
}: any) => {
  const errorMessage = get(errors, `${name}.message`, null);

  return (
    <>
      <Tooltip title={label} arrow>
        <Typography sx={{ ...labelStyle }} component={"span"}>
          {label.length > 20 ? label.slice(0, 20) + "..." : label}
        </Typography>
      </Tooltip>
      {required && (
        <Box component={"span"} color={"var(--error)"}>
          *
        </Box>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete<AutoOption, boolean, false, false>
            multiple={multiple}
            limitTags={limitTags}
            options={options || []}
            disabled={disabled}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  fontFamily: "Regular_M",
                  fontSize: "14px",
                  padding: "8px 12px !important",
                }}
              >
                {option.label}
              </Box>
            )}
            value={
              multiple
                ? options.filter((opt: any) => field.value?.includes(opt.title))
                : options.find((opt: any) => opt.title === field.value) || null
            }
            onChange={(_, newValue) => {
              if (multiple) {
                const titles = Array.isArray(newValue)
                  ? newValue.map((v) => v.title)
                  : [];
                field.onChange(titles);
              } else {
                const title = (newValue as AutoOption | null)?.title ?? "";
                field.onChange(title);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={!!errorMessage}
                helperText={errorMessage ? errorMessage.toString() : helperText}
                InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
                sx={{
                  ...CustomInputStyles,
                  ...CustomAutocompleteStyles,
                }}
              />
            )}
            disablePortal 
            sx={{ width: "100%" }}
          />
        )}
      />
    </>
  );
};

// SINGLE
// company: z.string().min(1, { message: "Company is required" }).nullable(),

// MULTIPLE
// company: z
//     .array(z.string().min(1))
//     .min(1, { message: "Company is required" }),
