interface GreetUserProps {
  userName: string;
}

export default function GreetUser({ userName }: GreetUserProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-lg bg-gray-50 dark:bg-slate-700/80 px-4 py-2 shadow-sm">
      <span className="text-sm xl:text-md text-gray-700 dark:text-gray-100">
        Olá,
      </span>
      <strong className="text-md xl:text-lg text-black dark:text-white font-bold">
        {userName}
      </strong>
    </div>
  );
}
