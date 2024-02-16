import { TextField } from "@mui/material";
import React from "react";

function InputField({
  label,
  type,
  value,
  onChange,
  error,
  name,
  id,
  helperText,
  onBlur,
}) {
  return (
    <div className="InputField">
      <TextField
        type={type}
        label={label}
        size="small"
        value={value}
        onChange={onChange}
        error={error}
        autoComplete="on"
        name={name}
        id={id}
        helperText={helperText}
        onBlur={onBlur}
      />
    </div>
  );
}

export default InputField;
