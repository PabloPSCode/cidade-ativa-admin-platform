import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const BASE_CLASSES =
  "w-full min-h-[40px] flex items-center justify-center border border-transparent bg-primary normal-case px-4 py-2 text-sm font-medium font-primary text-white rounded-md hover:bg-primary-dark disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-400";

export function Button({ title, className, ...rest }: ButtonProps) {
  return (
    <button className={`${BASE_CLASSES} ${className ?? ""}`} {...rest}>
      {title}
    </button>
  );
}
