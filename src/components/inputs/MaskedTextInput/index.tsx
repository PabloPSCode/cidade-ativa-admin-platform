import { forwardRef } from "react";
import InputMask, { Props } from "react-input-mask";
import "../../../styles/globals.css";

interface TextInputProps extends Props {
  inputLabel: string;
}

export const MaskedTextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ inputLabel, ...rest }, ref) => {
    return (
      <div className="mb-1.5 w-full">
        <span className="text-[12px] font-semibold text-[#4e4e4e]">
          {inputLabel}
        </span>
        <InputMask
          className="placeholder-custom mt-1 h-[40px] w-full rounded border border-[#cfcfcf] bg-[#f0f0f0] px-3 text-[13px] text-[#535353] outline-none focus:border-[#b8b8b8]"
          inputRef={ref}
          {...rest}
        />
      </div>
    );
  }
);

MaskedTextInput.displayName = "MaskedTextInput";
