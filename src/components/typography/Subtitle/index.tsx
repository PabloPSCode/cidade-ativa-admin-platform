import { HTMLAttributes } from "react";

interface SubtitleProps extends HTMLAttributes<HTMLHeadingElement> {
  content: string;
}
export function Subtitle({ content, ...rest }: SubtitleProps) {
  return (
    <h3
      className="font-primary text-[12px] font-medium text-slate-600 dark:text-slate-200 md:text-[14px]"
      {...rest}
    >
      {content}
    </h3>
  );
}
