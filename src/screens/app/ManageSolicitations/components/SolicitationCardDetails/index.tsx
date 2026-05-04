import ProductImageVisualizer from "@/components/miscellaneous/ProductImageVisualizer";
import {
  formatSolicitationDate,
  solicitationStatusMap,
} from "@/data/mockedSolicitations";
import type { SolicitationRecord } from "@/interfaces/dtos/Solicitation";
import type { ReactNode } from "react";
import {
  PiCalendarDots,
  PiChatCircleText,
  PiMapPinArea,
  PiMapPinLine,
  PiSpinnerGap,
  PiUserCircle,
} from "react-icons/pi";

export interface SolicitationCardDetailsProps
  extends Omit<SolicitationRecord, "id"> {
  className?: string;
  entityLabel?: string;
  statusLabel?: string;
  requestingUserLabel?: string;
  descriptionLabel?: string;
  resolutionCommentLabel?: string;
  addressLabel?: string;
  resolvedAtLabel?: string;
  mapSectionTitle?: string;
  mapTitlePrefix?: string;
  beforeImagesLabel?: string;
  afterImagesLabel?: string;
  resolveButtonLabel?: string;
  onMarkAsResolved?: () => void;
}

function DetailsInfoBlock({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.35rem] bg-gray-50 dark:bg-white/[0.03] p-4 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400">
        {label}
      </p>
      <div className="mt-2 flex items-start gap-2 text-sm font-semibold text-slate-800 dark:text-gray-100 sm:text-base">
        {icon && (
          <span className="mt-0.5 shrink-0 text-slate-500 dark:text-gray-400">
            {icon}
          </span>
        )}
        <div className="min-w-0">{value}</div>
      </div>
    </div>
  );
}

function DetailsTextSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.6rem] border border-gray-200/70 dark:border-slate-600/70 bg-gray-50/70 dark:bg-white/[0.02] p-5">
      <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-gray-100 font-secondary">
        {title}
      </h3>
      <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-gray-300 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function DetailsImageSection({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  return (
    <section className="rounded-[1.6rem] border border-gray-200/70 dark:border-slate-600/70 bg-gray-50/70 dark:bg-white/[0.02] p-5">
      <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-gray-100 font-secondary">
        {title}
      </h3>

      {images.length > 0 ? (
        <ProductImageVisualizer
          images={images.map((src, index) => ({
            src,
            alt: `${title} ${index + 1}`,
          }))}
          className="mt-4 rounded-[1.2rem] !bg-transparent"
          mainImageClassName="rounded-[1.2rem]"
          thumbClassName="rounded-xl"
        />
      ) : (
        <div className="mt-4 rounded-[1.2rem] border border-dashed border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-8 text-sm text-slate-500 dark:text-gray-400">
          Nenhuma imagem complementar foi adicionada até o momento.
        </div>
      )}
    </section>
  );
}

export default function SolicitationCardDetails({
  protocolNumber,
  requestingUserId,
  description,
  resolutionComment,
  imageUrls,
  resolutionImageUrls,
  neighborhood,
  createdAt,
  resolvedAt,
  street,
  mapAddress,
  status,
  className = "",
  entityLabel = "Solicitação",
  statusLabel,
  requestingUserLabel = "Requerente",
  descriptionLabel = "Descrição",
  resolutionCommentLabel = "Comentário",
  addressLabel = "Endereço",
  resolvedAtLabel = "Data de resolução",
  mapSectionTitle = "Localização no mapa",
  mapTitlePrefix = "Mapa da solicitação",
  beforeImagesLabel = "Imagens antes",
  afterImagesLabel = "Imagens depois",
  resolveButtonLabel = "Marcar como resolvida",
  onMarkAsResolved,
}: SolicitationCardDetailsProps) {
  const statusConfig = solicitationStatusMap[status];
  const isResolved = status === "resolved";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapAddress
  )}&output=embed`;

  return (
    <article
      className={`rounded-[2rem] border border-gray-200/70 dark:border-slate-600/70 bg-white dark:bg-slate-700 p-5 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.45)] sm:p-6 lg:p-8 ${className}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailsInfoBlock label={entityLabel} value={protocolNumber} />

          <DetailsInfoBlock
            label="Status"
            value={
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${statusConfig.badgeClassName}`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${statusConfig.dotClassName}`}
                />
                {statusLabel ?? statusConfig.label}
              </span>
            }
          />

          <DetailsInfoBlock
            label="Data de cadastro"
            icon={<PiCalendarDots size={18} />}
            value={formatSolicitationDate(createdAt)}
          />

          <DetailsInfoBlock
            label={requestingUserLabel}
            icon={<PiUserCircle size={18} />}
            value={requestingUserId}
          />
        </div>

        {onMarkAsResolved ? (
          <button
            type="button"
            onClick={onMarkAsResolved}
            disabled={isResolved}
            className="h-12 shrink-0 rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 lg:self-start"
          >
            {isResolved ? "Solicitação resolvida" : resolveButtonLabel}
          </button>
        ) : null}
      </div>

      {isResolved ? (
        <div className="mt-4">
          <DetailsInfoBlock
            label={resolvedAtLabel}
            icon={<PiSpinnerGap size={18} />}
            value={formatSolicitationDate(resolvedAt)}
          />
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <DetailsTextSection title={descriptionLabel}>
          {description}
        </DetailsTextSection>
        <DetailsTextSection title={resolutionCommentLabel}>
          <div className="flex items-start gap-3">
            <PiChatCircleText
              size={20}
              className="mt-1 shrink-0 text-slate-500 dark:text-gray-400"
            />
            <p>{resolutionComment}</p>
          </div>
        </DetailsTextSection>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <DetailsInfoBlock
          label={addressLabel}
          icon={<PiMapPinLine size={18} />}
          value={street}
          className="min-h-[7.5rem]"
        />
        <DetailsInfoBlock
          label="Bairro"
          icon={<PiMapPinArea size={18} />}
          value={neighborhood}
          className="min-h-[7.5rem]"
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <section className="rounded-[1.6rem] border border-gray-200/70 dark:border-slate-600/70 bg-gray-50/70 dark:bg-white/[0.02] p-5">
          <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-gray-100 font-secondary">
            {mapSectionTitle}
          </h3>
          <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-gray-200/70 dark:border-slate-600/70">
            <iframe
              title={`${mapTitlePrefix} ${protocolNumber}`}
              src={mapSrc}
              className="aspect-[4/3] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ minHeight: 300, border: 0 }}
            />
          </div>
        </section>

        <DetailsImageSection title={beforeImagesLabel} images={imageUrls} />
        <DetailsImageSection
          title={afterImagesLabel}
          images={resolutionImageUrls}
        />
      </div>
    </article>
  );
}
