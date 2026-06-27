import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { NotFound } from "@/screens/404";
import { CoolActions } from "@/screens/app/CoolActions";
import { GeneralSolicitations } from "@/screens/app/GeneralSolicitations";
import { Home } from "@/screens/app/Home";
import { LegalCitizenActions } from "@/screens/app/LegalCitizenActions";
import { LegalCitizenRanking } from "@/screens/app/LegalCitizenRanking";
import { DashboardLayout } from "@/screens/app/layout";

import { ManageSolicitations } from "@/screens/app/ManageSolicitations";
import { Polls } from "@/screens/app/Polls";
import { PublicPhones } from "@/screens/app/PublicPhones";
import { ErrorPage } from "@/screens/error";
import { ReactNode } from "react";

type route = {
  path: string;
  element: ReactNode;
};

const appRoutesBase: route[] = [
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Home />,
  },
    {
    path: "/dashboard/gerenciar-solicitacoes/:id",
    element: <ManageSolicitations />,
  },
  {
    path: "/dashboard/solicitacoes",
    element: <GeneralSolicitations />,
  },
  {
    path: "/dashboard/telefones-publicos",
    element: <PublicPhones />,
  },
  {
    path: "/dashboard/enquetes",
    element: <Polls />,
  },
  {
    path: "/dashboard/acoes",
    element: <CoolActions />,
  },
  {
    path: "/dashboard/cidadao-legal",
    element: <LegalCitizenRanking />,
  },
  {
    path: "/dashboard/cidadao-legal/:citizenId/acoes",
    element: <LegalCitizenActions />,
  },
];

const appRoutes = appRoutesBase.map((route) => ({
  path: route.path,
  element: <DashboardLayout>{route.element}</DashboardLayout>,
  errorElement: <ErrorPage />,
}));

const appRouter = createBrowserRouter(appRoutes);

const AppRouter: React.FC = () => {
  return <RouterProvider router={appRouter} />;
};

export default AppRouter;
