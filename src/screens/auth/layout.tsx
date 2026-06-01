import logo from "@/assets/logo.png";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface AuthenticationLayoutProps {
    children: ReactNode;
}

export const AuthenticationLayout: React.FC<AuthenticationLayoutProps> = ({
    children,
}: AuthenticationLayoutProps) => {
    return (
        <div className="tesla-theme flex min-h-screen w-full flex-col bg-slate-100 pb-8 dark:bg-slate-900">
            <Toaster />
            <main className="flex flex-1 items-center justify-center px-4 pt-8">
                {children}
            </main>
            <footer className="flex w-full flex-col items-center pb-2">
                <div className="rounded-md border border-slate-200 bg-white px-6 py-2 dark:border-slate-700 dark:bg-slate-800">
                    <img src={logo} alt="Logo Cidade Ativa" width={175} height={70} />
                </div>
                <a className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-300"
                    href="https://www.plssistemas.com.br" target="_blank">
                    Desenvolvido por PLS Sistemas
                </a>
            </footer>
        </div>
    );
};
