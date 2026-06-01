import { solicitationStats } from "@/data/mockedSolicitations";
import type { SolicitationStatus } from "@/interfaces/dtos/Solicitation";
import { ReactNode } from "react";
import {
    PiBuildings,
    PiChartBar,
    PiCheckCircle,
    PiClockCountdown,
    PiSpinnerGap,
    PiXCircle,
} from "react-icons/pi";
import { Link } from "react-router-dom";

const formatCountLabel = (value: number, singular: string, plural: string) =>
    `${value} ${value === 1 ? singular : plural}`;

const buildSolicitationsListHref = (status?: SolicitationStatus) =>
    status
        ? `/dashboard/solicitacoes?status=${status}`
        : "/dashboard/solicitacoes";

interface StatCardProps {
    to: string;
    label: string;
    value: number;
    description: string;
    icon: ReactNode;
    iconWrapperClassName: string;
    borderClassName: string;
}

function StatCard({
    to,
    label,
    value,
    description,
    icon,
    iconWrapperClassName,
    borderClassName,
}: StatCardProps) {
    return (
        <Link
            to={to}
            className="block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
        >
            <article
                className={`h-full rounded-md border ${borderClassName} bg-white dark:bg-slate-700 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
            >
                <div className="flex items-center gap-2.5">
                    <div
                        className={`shrink-0 rounded-md p-2.5 ${iconWrapperClassName}`}
                    >
                        {icon}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-gray-400">
                            {label}
                        </p>
                        <p className="text-xl font-black leading-tight text-slate-800 dark:text-gray-100">
                            {value}
                        </p>
                    </div>
                </div>
                <p className="mt-3 text-[13px] leading-5 text-slate-600 dark:text-gray-300">
                    {description}
                </p>
            </article>
        </Link>
    );
}

export default function GeneralPanel() {
    return (
        <section className="flex w-full flex-col gap-6 rounded-md border border-gray-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-3 rounded-md bg-gray-50 dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-gray-200 shadow-sm">
                        <PiBuildings size={22} />
                        <span>Solicitações gerais</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-gray-100 sm:text-4xl font-secondary">
                            Painel administrativo de solicitações urbanas
                        </h1>
                        <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-gray-300 sm:text-base">
                            Consulte situações reportadas pela comunidade, filtre por bairro,
                            status e requerente, e acompanhe a data de cadastro das
                            ocorrências.
                        </p>
                    </div>

                    <p className="text-sm font-medium text-slate-600 dark:text-gray-300 sm:text-base">
                        Atualmente existem{" "}
                        <span className="font-bold text-slate-800 dark:text-gray-100">
                            {solicitationStats.total} solicitações cadastradas
                        </span>
                        .
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    to={buildSolicitationsListHref()}
                    label="Total"
                    value={solicitationStats.total}
                    description={`${formatCountLabel(
                        solicitationStats.total,
                        "registro",
                        "registros"
                    )} da comunidade nesta listagem mockada.`}
                    icon={<PiChartBar size={20} />}
                    iconWrapperClassName="bg-gray-100 dark:bg-white/5 text-slate-700 dark:text-gray-200"
                    borderClassName="border-gray-200 dark:border-slate-600"
                />

                <StatCard
                    to={buildSolicitationsListHref("not_resolved")}
                    label="Pendentes"
                    value={solicitationStats.pending}
                    description="Casos que ainda aguardam uma resposta definitiva."
                    icon={<PiClockCountdown size={20} />}
                    iconWrapperClassName="bg-amber-500/15 text-amber-600 dark:text-amber-300"
                    borderClassName="border-amber-500/20"
                />

                <StatCard
                    to={buildSolicitationsListHref("in_progress")}
                    label="Em andamento"
                    value={solicitationStats.inProgress}
                    description="Demandas acompanhadas pelos setores responsáveis."
                    icon={<PiSpinnerGap size={20} />}
                    iconWrapperClassName="bg-amber-500/15 text-amber-600 dark:text-amber-300"
                    borderClassName="border-amber-500/20"
                />

                <StatCard
                    to={buildSolicitationsListHref("resolved")}
                    label="Resolvidas"
                    value={solicitationStats.resolved}
                    description="Solicitações marcadas como concluídas no fluxo atual."
                    icon={<PiCheckCircle size={20} />}
                    iconWrapperClassName="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                    borderClassName="border-emerald-500/20"
                />

                <StatCard
                    to={buildSolicitationsListHref("disregarded")}
                    label="Desconsideradas"
                    value={solicitationStats.disregarded}
                    description="Solicitações descartadas após análise da equipe."
                    icon={<PiXCircle size={20} />}
                    iconWrapperClassName="bg-red-500/15 text-red-600 dark:text-red-300"
                    borderClassName="border-red-500/20"
                />
            </div>
        </section>
    );
}
