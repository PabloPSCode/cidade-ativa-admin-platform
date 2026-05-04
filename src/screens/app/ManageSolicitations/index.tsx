import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { getSolicitationById } from "@/data/mockedSolicitations";
import type { SolicitationRecord } from "@/interfaces/dtos/Solicitation";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SolicitationCardDetails from "./components/SolicitationCardDetails";

export function ManageSolicitations() {
  const { id } = useParams<{ id: string }>();
  const [solicitation, setSolicitation] = useState<
    SolicitationRecord | undefined
  >(() => (id ? getSolicitationById(id) : undefined));

  useEffect(() => {
    setSolicitation(id ? getSolicitationById(id) : undefined);
  }, [id]);

  const handleMarkAsResolved = () => {
    setSolicitation((current) =>
      current
        ? {
            ...current,
            status: "resolved",
            resolvedAt: new Date().toISOString(),
            resolutionComment:
              current.resolutionComment ||
              "Solicitação marcada como resolvida pela equipe administrativa.",
          }
        : current
    );
  };

  return (
    <main className="flex flex-1 flex-col w-[90%] lg:w-full mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="mb-4 flex w-full flex-row items-center px-4">
        <HeaderNavigation
          screenTitle={
            solicitation
              ? `Solicitação ${solicitation.protocolNumber}`
              : "Gerenciar solicitação"
          }
        />
      </div>

      <div className="flex flex-col gap-6 px-4">
        {solicitation ? (
          <SolicitationCardDetails
            title={solicitation.title}
            protocolNumber={solicitation.protocolNumber}
            requestingUserId={solicitation.requestingUserId}
            description={solicitation.description}
            resolutionComment={solicitation.resolutionComment}
            imageUrls={solicitation.imageUrls}
            resolutionImageUrls={solicitation.resolutionImageUrls}
            neighborhood={solicitation.neighborhood}
            createdAt={solicitation.createdAt}
            resolvedAt={solicitation.resolvedAt}
            street={solicitation.street}
            mapAddress={solicitation.mapAddress}
            status={solicitation.status}
            onMarkAsResolved={handleMarkAsResolved}
          />
        ) : (
          <div className="rounded-[2rem] border border-dashed border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100">
              Solicitação não encontrada
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
              O identificador informado não corresponde a nenhuma solicitação
              cadastrada.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
