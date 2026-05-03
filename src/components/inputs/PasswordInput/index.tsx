import { forwardRef, InputHTMLAttributes, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../../../styles/globals.css";

interface PasswordTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputLabel: string;
}

export const PasswordTextInput = forwardRef<
  HTMLInputElement,
  PasswordTextInputProps
>(({ inputLabel, ...rest }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="mb-1.5 w-full">
      <span className="text-[12px] font-semibold text-[#4e4e4e]">
        {inputLabel}
      </span>
      <div className="mt-1 flex h-[40px] w-full flex-row overflow-hidden rounded border border-[#cfcfcf] bg-[#f0f0f0] focus-within:border-[#b8b8b8]">
        <input
          className="placeholder-custom h-full w-[calc(100%-40px)] bg-transparent px-3 text-[13px] text-[#535353] outline-none"
          type={isPasswordVisible ? "text" : "password"}
          ref={ref}
          {...rest}
        />
        <button
          onClick={handleTogglePasswordVisibility}
          className="flex h-full w-[40px] items-center justify-center border-none bg-transparent outline-none"
          type="button"
        >
          {isPasswordVisible ? (
            <FiEyeOff color="#b8b8b8" size={20} />
          ) : (
            <FiEye color="#b8b8b8" size={20} />
          )}
        </button>
      </div>
    </div>
  );
});

PasswordTextInput.displayName = "PasswordTextInput";
