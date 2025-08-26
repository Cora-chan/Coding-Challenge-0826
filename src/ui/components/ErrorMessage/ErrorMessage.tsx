
import React from "react";
import $ from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className={$.error}>
    <span>🚫</span>{message}
  </div>
);

export default ErrorMessage;
