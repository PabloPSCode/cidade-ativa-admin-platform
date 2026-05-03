import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const BASE_CLASSES =
  "w-full h-[52px] flex items-center justify-center bg-primary normal-case lg:text-base text-sm font-medium font-poppins rounded-lg text-gray-50 font-secondary hover:bg-primary-dark disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300";

export function Button({ title, className, ...rest }: ButtonProps) {
  return (
    <button className={`${BASE_CLASSES} ${className ?? ""}`} {...rest}>
      {title}
    </button>
  );
}
