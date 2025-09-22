import { Autocomplete, Box, TextField } from "@mui/material";
import { CustomAutocompleteStyles, CustomInputStyles } from "../assets/Styles/CustomStyles";
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
}: any) => {
  const errorMessage = get(errors, `${name}.message`, null);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete<AutoOption, boolean, false, false>
            multiple={multiple}
            limitTags={limitTags}
            options={options || []}
            getOptionLabel={(option) => option.label}
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
                label={
                  <>
                    {label}
                    {required && <Box component={"span"}>*</Box>}
                  </>
                }
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
            sx={{ width: "100%", marginTop: "10px" }}
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
