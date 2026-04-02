import { type ReactNode } from "react";

type RunFormFieldProps = {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
};

function RunFormField({
  id,
  label,
  helperText,
  error,
  children,
}: RunFormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {helperText ? <p className="field-helper">{helperText}</p> : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

export default RunFormField;
