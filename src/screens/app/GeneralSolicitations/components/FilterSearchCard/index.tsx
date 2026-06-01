import type { SolicitationStatus } from "@/interfaces/dtos/Solicitation";
import type { Dispatch, SetStateAction } from "react";
import {
  PiArrowsDownUp,
  PiFunnelSimple,
  PiMagnifyingGlass,
  PiMapPin,
  PiSpinnerGap,
  PiUserCircle,
} from "react-icons/pi";

export interface FilterSearchCardProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  neighborhood: string;
  neighborhoods: string[];
  onNeighborhoodChange: (value: string) => void;
  status: SolicitationStatus | "all";
  statuses: Array<{
    value: SolicitationStatus;
    label: string;
  }>;
  onStatusChange: (value: SolicitationStatus | "all") => void;
  requestingUserId: string;
  requestingUsers: string[];
  onRequestingUserIdChange: (value: string) => void;
  dateOrder: "recent" | "oldest";
  onDateOrderChange: (value: "recent" | "oldest") => void;
  onResetFilters: () => void;
  className?: string;
}

const selectClassName =
  "h-12 w-full rounded-md border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-white/[0.03] px-4 text-sm font-semibold text-slate-800 dark:text-gray-100 outline-none transition focus:border-slate-400 dark:focus:border-slate-400";

export default function FilterSearchCard({
  search,
  setSearch,
  neighborhood,
  neighborhoods,
  onNeighborhoodChange,
  status,
  statuses,
  onStatusChange,
  requestingUserId,
  requestingUsers,
  onRequestingUserIdChange,
  dateOrder,
  onDateOrderChange,
  onResetFilters,
  className = "",
}: FilterSearchCardProps) {
  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <div className="relative">
        <PiMagnifyingGlass
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pesquise por uma situação ou bairro"
          className="h-14 w-full rounded-[1.85rem] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 pl-14 pr-5 text-sm font-medium text-slate-800 dark:text-gray-100 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] outline-none transition focus:border-slate-400 dark:focus:border-slate-400 sm:text-base"
        />
      </div>

      <div className="rounded-[1.85rem] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-gray-100 sm:text-base">
            <span className="rounded-md bg-gray-50 dark:bg-white/[0.03] p-3 text-slate-700 dark:text-gray-200">
              <PiFunnelSimple size={18} />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span>Filtro</span>
              <span className="text-slate-400">-</span>
              <span className="text-slate-500 dark:text-gray-400">
                Ordenar por:
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="text-sm font-semibold text-slate-500 dark:text-gray-400 transition hover:text-slate-800 dark:hover:text-gray-100"
          >
            Limpar filtros
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              <PiMapPin size={14} />
              Bairro
            </span>
            <select
              value={neighborhood}
              onChange={(event) => onNeighborhoodChange(event.target.value)}
              className={selectClassName}
            >
              <option value="all">Todos os bairros</option>
              {neighborhoods.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              <PiSpinnerGap size={14} />
              Status
            </span>
            <select
              value={status}
              onChange={(event) =>
                onStatusChange(event.target.value as SolicitationStatus | "all")
              }
              className={selectClassName}
            >
              <option value="all">Todos os status</option>
              {statuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              <PiUserCircle size={14} />
              Requerente
            </span>
            <select
              value={requestingUserId}
              onChange={(event) =>
                onRequestingUserIdChange(event.target.value)
              }
              className={selectClassName}
            >
              <option value="all">Todos os requerentes</option>
              {requestingUsers.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              <PiArrowsDownUp size={14} />
              Data da solicitação
            </span>
            <select
              value={dateOrder}
              onChange={(event) =>
                onDateOrderChange(event.target.value as "recent" | "oldest")
              }
              className={selectClassName}
            >
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
