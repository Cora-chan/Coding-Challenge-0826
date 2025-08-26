import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {

  const variantMap: Record<string, string> = {
    primary: $.primary,
    secondary: $.secondary,
    tertiary: $.tertiary, // add more variants as needed
  };

  const variantClass = variantMap[variant] || "";

  return (
    <button
      // TODO: Add conditional classNames
      // - Must have a condition to set the '.primary' className
      // - Must have a condition to set the '.secondary' className
      // - Display loading spinner per demo video. NOTE: add data-testid="loading-spinner" for spinner element (used for grading)
      className={`${$.button} ${variantClass}`}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <div className={$.spinnerContainer}><span data-testid="loading-spinner" className={$.spinner}>

        </span><span className={$.loadingText}>Loading</span></div>
      ) : (
        children
      )}

    </button>
  );
};

export default Button;