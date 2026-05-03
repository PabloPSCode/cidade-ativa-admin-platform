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
        <div className="flex min-h-screen w-full flex-col bg-[#f5f5f5] pb-8">
            <Toaster />
            <main className="flex flex-1 items-center justify-center px-4 pt-8">
                {children}
            </main>
            <footer className="flex w-full flex-col items-center pb-2">
                <div className="rounded-lg bg-white px-6 py-2 shadow-sm">
                    <img src={logo} alt="Logo Cidade Ativa" width={175} height={70} />
                </div>
                <a className="mt-3 text-xs font-medium"
                    href="https://www.plssistemas.com.br" target="_blank">
                    Desenvolvido por PLS Sistemas
                </a>
            </footer>
        </div>
    );
};
