import { ButtonHTMLAttributes } from "react";

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const BASE_CLASSES =
  "text-primary dark:text-primary-light normal-case text-sm font-medium font-poppins rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed";

export function LinkButton({ title, className, ...rest }: LinkButtonProps) {
  return (
    <button className={`${BASE_CLASSES} ${className ?? ""}`} {...rest}>
      {title}
    </button>
  );
}
