import GreetUser from "@/components/miscellaneous/GreetUser";
import { Title } from "@/components/typography/Title";
import Feather from "feather-icons-react";
import GeneralPanel from "../GeneralSolicitations/components/GeneralPanel";

export function Home() {
  return (
    <main className="min-h-screen w-full bg-gray-100 dark:bg-slate-800">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="flex flex-col gap-4">
          <GreetUser userName="John Doe" />
          <div className="flex items-center gap-2">
            <Feather
              icon="bar-chart-2"
              className="h-8 w-8 text-black dark:text-white"
            />
            <Title
              content="Visão geral da sua plataforma"
              className="text-black dark:text-white text-lg md:text-xl font-bold font-secondary"
            />
          </div>
        </header>

        <GeneralPanel />
      </div>
    </main>
  );
}
