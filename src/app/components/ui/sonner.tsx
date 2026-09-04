"use client";

import { useTheme } from "../../contexts/ThemeContext";
import { Toaster as Sonner } from "sonner";

const Toaster = () => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme === "dark" ? "dark" : "light"}
      position="top-center"
      expand={true}
      richColors={false}
      toastOptions={{
        style: {
          background: 'rgb(22 163 74)',
          color: 'white',
          border: '1px solid rgb(21 128 61)',
          fontSize: '1.125rem',
          padding: '1rem 1.5rem',
          fontWeight: '600',
        },
        className: 'toast-custom',
      }}
    />
  );
};

export { Toaster };
