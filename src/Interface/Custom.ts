import type { SxProps } from "@mui/material";
import type { ButtonProps } from "@mui/material/Button";
import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export interface CustomButtonProps {
  type: "button" | "submit" | "reset";
  variant?: ButtonProps["variant"];
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: ButtonProps["size"];
  label: string;
  loading?: boolean;
  disabled?: boolean;
  boxSx?: any;
  onClick?: ButtonProps["onClick"];
}

export interface CustomInputProps {
  label?: any;
  required?: boolean;
  placeholder?: string;
  type?: string;
  name: string;
  disabled?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  register?: UseFormRegister<any>;
  helperText?: string;
  errors?: FieldErrors;
  value?: string | number;
  boxSx?: SxProps;
}

export interface SidebarProps {
  onNavigate?: () => void;
  onNavigateLink?: (path: string) => void;
  onLogout?: () => void;
  onProfileSettings?: () => void;
}
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiRequestConfig {
  url: string;
  method: HttpMethod;
  data?: Record<string, any>;
  headers?: Record<string, string>;
  responseType?: "json" | "arraybuffer";
}

export interface ApiResponse<T = any> {
  data: T;
  status: boolean;
  message?: string;
  tickets?: T[];
  statusCode?: number;
  user?: T;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: { [key: string]: string };
  loading?: boolean;
  error?: Error;
  rawResponse?: any; // To store the original response data for debugging
}