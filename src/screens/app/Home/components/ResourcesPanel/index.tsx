import { listCoolActions } from "@/services/cool-actions";
import { listPolls } from "@/services/polls";
import { listPublicPhones } from "@/services/public-phones";
import { getErrorMessage, showAlertError } from "@/utils/alerts";
import { ReactNode, useEffect, useState } from "react";
import {
  PiArrowRight,
  PiChartBar,
  PiHandHeart,
  PiPhoneCall,
  PiTrophy,
} from "react-icons/pi";
import { Link } from "react-router-dom";

interface ResourceCardProps {
  to: string;
  label: string;
  value: ReactNode;
  description: string;
  icon: ReactNode;
  iconWrapperClassName: string;
  borderClassName: string;
}

function ResourceCard({
  to,
  label,
  value,
  description,
  icon,
  iconWrapperClassName,
  borderClassName,
}: ResourceCardProps) {
  return (
    <Link
      to={to}
      className="block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
    >
      <article
        className={`h-full rounded-md border ${borderClassName} bg-white dark:bg-slate-700 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`shrink-0 rounded-md p-2.5 ${iconWrapperClassName}`}>
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

export default function ResourcesPanel() {
  const [publicPhonesCount, setPublicPhonesCount] = useState(0);
  const [coolActionsCount, setCoolActionsCount] = useState(0);
  const [pollsCount, setPollsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      setIsLoading(true);
      try {
        const [publicPhones, coolActions, polls] = await Promise.all([
          listPublicPhones({ page: 1, perPage: 100 }),
          listCoolActions({ page: 1, perPage: 100 }),
          listPolls({ page: 1, perPage: 100 }),
        ]);
        if (cancelled) return;
        setPublicPhonesCount(publicPhones.meta.total);
        setCoolActionsCount(coolActions.meta.total);
        setPollsCount(polls.meta.total);
      } catch (error) {
        if (!cancelled) {
          setPublicPhonesCount(0);
          setCoolActionsCount(0);
          setPollsCount(0);
          showAlertError(
            getErrorMessage(
              error,
              "Não foi possível carregar os recursos da plataforma.",
            ),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayValue = (value: number): ReactNode => (isLoading ? "—" : value);

  return (
    <section className="flex w-full flex-col gap-6 rounded-md border border-gray-200 dark:border-slate-600 bg-white/70 dark:bg-slate-700/80 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-7">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-gray-100 sm:text-3xl font-secondary">
          Recursos da plataforma
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-gray-300 sm:text-base">
          Acompanhe os demais recursos cadastrados e acesse rapidamente as áreas
          de gestão.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ResourceCard
          to="/dashboard/telefones-publicos"
          label="Telefones públicos"
          value={displayValue(publicPhonesCount)}
          description="Telefones de instituições disponibilizados à comunidade."
          icon={<PiPhoneCall size={20} />}
          iconWrapperClassName="bg-sky-500/15 text-sky-600 dark:text-sky-300"
          borderClassName="border-sky-500/20"
        />

        <ResourceCard
          to="/dashboard/acoes"
          label="Ações"
          value={displayValue(coolActionsCount)}
          description="Ações que os cidadãos podem realizar para pontuar."
          icon={<PiHandHeart size={20} />}
          iconWrapperClassName="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
          borderClassName="border-emerald-500/20"
        />

        <ResourceCard
          to="/dashboard/enquetes"
          label="Enquetes"
          value={displayValue(pollsCount)}
          description="Enquetes ativas e finalizadas da comunidade."
          icon={<PiChartBar size={20} />}
          iconWrapperClassName="bg-violet-500/15 text-violet-600 dark:text-violet-300"
          borderClassName="border-violet-500/20"
        />

        <Link
          to="/dashboard/cidadao-legal"
          className="block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
        >
          <article className="flex h-full flex-col justify-between gap-3 rounded-md border border-amber-500/20 bg-white dark:bg-slate-700 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="shrink-0 rounded-md bg-amber-500/15 p-2.5 text-amber-600 dark:text-amber-300">
                <PiTrophy size={20} />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-gray-400">
                  Cidadão legal
                </p>
                <p className="text-xl font-black leading-tight text-slate-800 dark:text-gray-100">
                  Ranking
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600 dark:text-emerald-300">
              Acessar ranking
              <PiArrowRight size={16} />
            </span>
          </article>
        </Link>
      </div>
    </section>
  );
}
