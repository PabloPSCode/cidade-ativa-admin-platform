import { HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  content: string;
}
export function Title({ content, ...rest }: TitleProps) {
  return (
    <h1
      className="font-secondary text-lg font-medium text-secondary dark:text-slate-100 md:text-xl"
      {...rest}
    >
      {content}
    </h1>
  );
}
