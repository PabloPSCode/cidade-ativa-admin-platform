import {
  formatSolicitationDate,
  solicitationStatusMap,
} from "@/data/mockedSolicitations";
import type { SolicitationSummary } from "@/interfaces/dtos/Solicitation";
import {
  PiCalendarDots,
  PiMapPinLine,
  PiSpinnerGap,
  PiUserCircle
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
      className={`rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] transition ${interactiveClasses} ${className}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-end gap-2.5">
          {detailsHref ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleNavigateToDetails();
              }}
              className="justify-center rounded-md bg-cyan-500 px-4 py-2.5 text-xs md:text-sm font-bold text-white transition hover:bg-primary-600"
            >
              {detailsButtonLabel}
            </button>
          ) : null}
        </div>
        <img
          src={mainImageUrl}
          alt={`Imagem de ${title.toLowerCase()} em ${street}`}
          className="h-44 w-full object-cover"
        />


        <div className="flex min-w-0 flex-col gap-4">
          <div className="space-y-2">
            <div className="space-y-2">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
                {titleLabel}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xs md:text-sm font-black tracking-tight text-slate-800 dark:text-gray-100">
                  {title}
                </h3>
              </div>
            </div>

            <p className="text-xs md:text-sm leading-6 text-slate-600 dark:text-gray-300">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 text-xs md:text-sm font-medium text-slate-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-md bg-gray-100 dark:bg-white/5 px-3 py-1.5">
              <PiMapPinLine size={16} />
              {street}
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-gray-100 dark:bg-white/5 px-3 py-1.5">
              <PiSpinnerGap size={16} />
              {neighborhood}
            </span>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2">
          <div className="rounded-md bg-gray-50 dark:bg-white/[0.03] p-3">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              Bairro
            </p>
            <p className="mt-1.5 text-xs md:text-sm font-semibold text-slate-800 dark:text-gray-100">
              {neighborhood}
            </p>
          </div>

          <div className="rounded-md bg-gray-50 dark:bg-white/[0.03] p-3">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              Status
            </p>
            <p className="mt-1.5 text-xs md:text-sm font-semibold text-slate-800 dark:text-gray-100">
              {statusLabel ?? statusConfig.label}
            </p>
          </div>

          <div className="rounded-md bg-gray-50 dark:bg-white/[0.03] p-3">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              {requestingUserLabel}
            </p>
            <div className="mt-1.5 flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-800 dark:text-gray-100">
              <PiUserCircle
                size={18}
                className="shrink-0 text-slate-500 dark:text-gray-400"
              />
              <span className="truncate">{requestingUserId}</span>
            </div>
          </div>

          <div className="rounded-md bg-gray-50 dark:bg-white/[0.03] p-3">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
              Data de cadastro
            </p>
            <div className="mt-1.5 flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-800 dark:text-gray-100">
              <PiCalendarDots
                size={18}
                className="shrink-0 text-slate-500 dark:text-gray-400"
              />
              <span>{formatSolicitationDate(createdAt)}</span>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}
