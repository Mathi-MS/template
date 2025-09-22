import React, { useEffect } from "react";
import {
  Toaster,
  ToastBar,
  toast,
  type ToastOptions,
  useToasterStore,
} from "react-hot-toast";

const MAX_VISIBLE = 2; 

const CustomToast: React.FC = () => {
  const { toasts } = useToasterStore();

  useEffect(() => {
    const visibleToasts = toasts.filter((t) => t.visible);
    if (visibleToasts.length > MAX_VISIBLE) {
      const toDismiss = visibleToasts.slice(
        0,
        visibleToasts.length - MAX_VISIBLE
      );
      toDismiss.forEach((t) => toast.dismiss(t.id));
    }
  }, [toasts]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        // Default (info) style
        style: {
          fontSize: "14px",
          padding: "10px 12px",
          background: "#ffffff",
          color: "#111827",
          minWidth:200,
        },
        // Success = green background
        success: {
          style: {
            background: "#22c55e",
            color: "#ffffff",
          },
        },
        // Error = red background
        error: {
          style: {
            background: "#ef4444",
            color: "#ffffff",
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {icon}
              <span>{message}</span>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default CustomToast;

// Lightweight helpers you can import anywhere
export const showSuccess = (message: string, options?: ToastOptions) =>
  toast.success(message, options);

export const showError = (message: string, options?: ToastOptions) =>
  toast.error(message, options);

export const showInfo = (message: string, options?: ToastOptions) =>
  toast(message, options);

export const showPromise = <T,>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string },
  options?: ToastOptions
) => toast.promise(promise, messages, options);
