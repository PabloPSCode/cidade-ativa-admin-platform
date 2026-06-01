import { InputHTMLAttributes, forwardRef } from "react";
import "../../../styles/globals.css";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputLabel: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ inputLabel, ...rest }, ref) => {
    return (
      <div className="mb-1.5 w-full">
        <span className="text-[12px] font-medium text-secondary dark:text-slate-200">
          {inputLabel}
        </span>
        <input
          className="placeholder-custom mt-1 h-[40px] w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-secondary outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          ref={ref}
          {...rest}
        />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
