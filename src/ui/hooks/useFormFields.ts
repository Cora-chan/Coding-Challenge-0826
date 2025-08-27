import { useState } from "react";

export default function useFormFields<T extends Record<string, string>>(
  initialValues: T
) {
  const [fields, setFields] = useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const resetFields = () => setFields(initialValues);

  const areFieldsFilled = (): boolean => {
    return Object.values(fields).every((value) => value.trim() !== "");
  };

  const getMissingFields = (): string[] => {
    return Object.entries(fields)
      .filter(([_, value]) => value.trim() === "")
      .map(([key]) => key);
  };

  return {
    fields,
    handleChange,
    resetFields,
    areFieldsFilled,
    getMissingFields,
  };
}
