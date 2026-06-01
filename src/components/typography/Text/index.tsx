import { HTMLAttributes } from "react";

interface TextProps extends HTMLAttributes<HTMLHeadingElement> {
  content: string;
}
export function Text({ content, ...rest }: TextProps) {
  return (
    <span
      className="font-primary text-[12px] font-normal text-slate-600 dark:text-slate-200 lg:text-sm"
      {...rest}
    >
      {content}
    </span>
  );
}
