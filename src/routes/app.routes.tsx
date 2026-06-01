import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { NotFound } from "@/screens/404";
import { Actions } from "@/screens/app/Actions";
import { GeneralSolicitations } from "@/screens/app/GeneralSolicitations";
import { Home } from "@/screens/app/Home";
import { LegalCitizenRanking } from "@/screens/app/LegalCitizenRanking";
import { DashboardLayout } from "@/screens/app/layout";

import { ManageSolicitations } from "@/screens/app/ManageSolicitations";
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
    path: "/dashboard/cidadao-legal",
    element: <LegalCitizenRanking />,
  },
  {
    path: "/dashboard/cidadao-legal/:citizenId/acoes",
    element: <Actions />,
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
