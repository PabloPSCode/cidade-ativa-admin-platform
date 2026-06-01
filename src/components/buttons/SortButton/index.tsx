import { ButtonHTMLAttributes } from "react";
import { PiSortAscendingLight, PiSortDescendingLight } from "react-icons/pi";

interface SortButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  sortType: "asc" | "desc";
}

export function SortButton({ sortType, ...rest }: SortButtonProps) {
  const buttonStyle =
    "mb-[-8px] flex flex-row items-center justify-center rounded-md border border-slate-300 bg-white p-1 text-secondary hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 disabled:opacity-[0.8]";

  return (
    <>
      {sortType === "asc" ? (
        <button className={buttonStyle} {...rest}>
          <PiSortAscendingLight className="mr-0.5 h-4 w-4 lg:h-5 lg:w-5" />
        </button>
      ) : (
        <button className={buttonStyle} {...rest}>
          <PiSortDescendingLight className="h-4 w-4 lg:h-5 lg:w-5" />
        </button>
      )}
    </>
  );
}
