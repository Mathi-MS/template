export const CustomInputStyles = {
  mb: 0,
  "& input": {
    padding: "12px",
    fontSize: "14px",
    fontFamily: "Regular_M",
  },
  "& label": {
    fontFamily: "Regular_M",
  },
  "& fieldset": {
    borderRadius: "8px",
  },
  "& .MuiInputBase-adornedStart input, & .MuiInputBase-inputAdornedStart": {
    paddingLeft: "5px",
  },
  "& .MuiFormHelperText-root": { margin: "5px 0px 0px 0px" },
  "& .MuiInputAdornment-root": {
    margin: "0px",
    "& .MuiSvgIcon-root": {
      fontSize: "20px",
      color: "var(--customIcon)",
    },
  },
  "& .MuiTextField-root": {
    width: "100%",
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border)",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border)",
      borderWidth: "1px",
    },
    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--error)",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "var(--title)",
    },
    "&.Mui-error": {
      color: "var(--error)",
    },
    "& .MuiBox-root": {
      paddingLeft: "2px",
    },
  },
};

export const labelStyle = {
  fontSize: "14px", fontFamily: "Medium_M",color:"var(--text-primary)",mb:"2px !important",display:"inline-block" 
};
export const CustomButtonStyles = {
  width: "100%",
  background: "var(--primary)",
  textTransform: "capitalize", 
  fontFamily:"Medium_M",
  borderRadius: "7px",
  fontSize:"14px"
};
export const CustomAutocompleteStyles = {
  "& input": {
    padding: "3px !important",
    fontSize: "14px",
    fontFamily: "Regular_M",
  },
  "& label": {
    fontSize: "16px",
    fontFamily: "Regular_M",
    color: "var(--title)",
  },
  "& fieldset": {
    borderWidth: "1px !important",
    borderColor: "var(--border) !important",
    borderRadius: "8px",
  },
  "& .Mui-error .MuiOutlinedInput-notchedOutline ": {
    borderWidth: "1px !important",
    borderColor: "var(--error) !important",
    borderRadius: "8px",
    fontSize:"Regular_M"
  },
};
