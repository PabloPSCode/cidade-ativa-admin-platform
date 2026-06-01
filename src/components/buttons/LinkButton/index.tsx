import { ButtonHTMLAttributes } from "react";

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const BASE_CLASSES =
  "text-tertiary dark:text-slate-300 normal-case text-sm font-normal font-primary rounded-md underline-offset-2 hover:underline disabled:text-slate-400 disabled:cursor-not-allowed";

export function LinkButton({ title, className, ...rest }: LinkButtonProps) {
  return (
    <button className={`${BASE_CLASSES} ${className ?? ""}`} {...rest}>
      {title}
    </button>
  );
}
