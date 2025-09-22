import Button from "@mui/material/Button";
import { CustomButtonStyles } from "../assets/Styles/CustomStyles";
import type { CustomButtonProps } from "../Interface/Custom";

const CustomButton: React.FC<CustomButtonProps> = ({
  type,
  variant,
  startIcon,
  endIcon,
  size,
  label,
  loading,
  disabled,
  boxSx,
  onClick,
}) => {
  return (
    <>
      <Button
        variant={variant}
        type={type}
        startIcon={startIcon}
        endIcon={endIcon}
        size={size}
        loading={loading}
        onClick={onClick}
        disabled={disabled}
        sx={{
          ...CustomButtonStyles,
          ...boxSx,
        }}
      >
        {label}
      </Button>
    </>
  );
};
export default CustomButton;
