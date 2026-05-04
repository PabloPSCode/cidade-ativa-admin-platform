import {
  formatSolicitationDate,
  solicitationStatusMap,
} from "@/data/mockedSolicitations";
import type { SolicitationSummary } from "@/interfaces/dtos/Solicitation";
import {
  PiCalendarDots,
  PiMapPinLine,
  PiPencilSimpleLine,
  PiSpinnerGap,
  PiTrash,
  PiUserCircle,
} from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export interface SolicitationCardProps
  extends Omit<SolicitationSummary, "id" | "protocolNumber"> {
  className?: string;
  detailsHref?: string;
  titleLabel?: string;
  requestingUserLabel?: string;
  statusLabel?: string;
  detailsButtonLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SolicitationCard({
  title,
  requestingUserId,
  description,
  imageUrls,
  neighborhood,
  createdAt,
  street,
  status,
  className = "",
  detailsHref,
  titleLabel = "Solicitação",
  requestingUserLabel = "Requerente",
  statusLabel,
  detailsButtonLabel = "Ver detalhes",
  onEdit,
  onDelete,
}: SolicitationCardProps) {
  const navigate = useNavigate();
  const statusConfig = solicitationStatusMap[status];
  const mainImageUrl = imageUrls[0] || "/logo.png";
  const isInteractive = Boolean(detailsHref);

  const handleNavigateToDetails = () => {
    if (detailsHref) {
      navigate(detailsHref);
    }
  };

  const hasManagementActions = Boolean(onEdit || onDelete);

  const interactiveClasses = isInteractive
    ? "cursor-pointer hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
    : "";

  return (
    <article
      role={isInteractive ? "link" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleNavigateToDetails : undefined}
      onKeyDown={
        isInteractive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleNavigateToDetails();
              }
            }
          : undefined
      }
      className={`rounded-[2rem] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] transition sm:p-5 xl:p-6 ${interactiveClasses} ${className}`}
    >
      <div className="grid gap-5 xl:grid-cols-[136px_minmax(0,1.45fr)_repeat(4,minmax(0,0.9fr))_auto] xl:items-center">
        <div className="relative h-44 overflow-hidden rounded-[1.5rem] bg-neutral-200 dark:bg-white/5 sm:h-52 xl:h-28 xl:w-[136px]">
          <img
            src={mainImageUrl}
            alt={`Imagem de ${title.toLowerCase()} em ${street}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="space-y-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
                {titleLabel}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-gray-100">
                  {title}
                </h3>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.badgeClassName}`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${statusConfig.dotClassName}`}
                  />
                  {statusLabel ?? statusConfig.label}
                </span>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-600 dark:text-gray-300 sm:text-[0.95rem]">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 text-xs font-medium text-slate-500 dark:text-gray-400 sm:text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/5 px-3 py-2">
              <PiMapPinLine size={16} />
              {street}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-white/5 px-3 py-2">
              <PiSpinnerGap size={16} />
              {neighborhood}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:contents">
          <div className="rounded-[1.25rem] bg-gray-50 dark:bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              Bairro
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-gray-100 sm:text-base">
              {neighborhood}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-gray-50 dark:bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              Status
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-gray-100 sm:text-base">
              {statusLabel ?? statusConfig.label}
            </p>
          </div>

          <div className="rounded-[1.25rem] bg-gray-50 dark:bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              {requestingUserLabel}
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-gray-100 sm:text-base">
              <PiUserCircle
                size={18}
                className="shrink-0 text-slate-500 dark:text-gray-400"
              />
              <span className="truncate">{requestingUserId}</span>
            </div>
          </div>

          <div className="rounded-[1.25rem] bg-gray-50 dark:bg-white/[0.03] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              Data de cadastro
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-gray-100 sm:text-base">
              <PiCalendarDots
                size={18}
                className="shrink-0 text-slate-500 dark:text-gray-400"
              />
              <span>{formatSolicitationDate(createdAt)}</span>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-wrap items-center gap-3 xl:justify-self-end ${
            hasManagementActions ? "xl:max-w-[18rem]" : "xl:max-w-[11rem]"
          }`}
        >
          {onEdit ? (
            <button
              type="button"
              title="Editar solicitação"
              aria-label="Editar solicitação"
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-white/[0.03] text-slate-700 dark:text-gray-200 transition hover:border-slate-300 dark:hover:border-slate-500"
            >
              <PiPencilSimpleLine size={20} />
            </button>
          ) : null}

          {onDelete ? (
            <button
              type="button"
              title="Excluir solicitação"
              aria-label="Excluir solicitação"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-500/10 text-rose-600 transition hover:bg-rose-500/15 dark:border-rose-400/20 dark:text-rose-300"
            >
              <PiTrash size={20} />
            </button>
          ) : null}

          <button
            type="button"
            onClick={
              detailsHref
                ? (event) => {
                    event.stopPropagation();
                    handleNavigateToDetails();
                  }
                : undefined
            }
            className="flex-1 justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 xl:min-w-[10rem]"
          >
            {detailsButtonLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
