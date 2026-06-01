import FeatherIcon from "feather-icons-react";
import { ButtonHTMLAttributes } from "react";

interface PlusButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

export function PlusButton({ title, ...rest }: PlusButtonProps) {
  return (
    <button
      className="flex min-w-5 flex-row items-center justify-center rounded-md border border-transparent p-0.5 sm:p-2 text-secondary dark:text-slate-100 disabled:opacity-[0.8]"
      {...rest}
    >
      <FeatherIcon
        icon="plus-circle"
        strokeWidth={1}
        className="mb-0.5 mr-1 block h-6 w-6 text-primary md:h-10 md:w-10"
      />
      <span className="hidden text-[12px] font-medium text-secondary dark:text-slate-100 sm:flex md:text-sm lg:text-base">
        {title}
      </span>
    </button>
  );
}
