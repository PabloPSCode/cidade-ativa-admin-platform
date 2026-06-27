import { SelectInput } from "@/components/inputs/SelectInput";
import SearchInput from "@/screens/app/GeneralSolicitations/components/SearchInput";
import type { PollStatus } from "@/screens/app/Polls/constants/polls";
import { FunnelSimpleIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";

export interface PollFilterCardProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  status: PollStatus | "all";
  statuses: Array<{ value: PollStatus; label: string }>;
  onStatusChange: (value: PollStatus | "all") => void;
  onResetFilters: () => void;
  className?: string;
}

export default function PollFilterCard({
  search,
  setSearch,
  status,
  statuses,
  onStatusChange,
  onResetFilters,
  className,
}: PollFilterCardProps) {
  return (
    <section
      className={clsx(
        "poll-filter-card Container flex flex-col gap-4",
        className
      )}
    >
      <SearchInput
        search={search}
        setSearch={setSearch}
        placeholder="Pesquise por uma enquete"
      />

      <div className="rounded-[1.85rem] border border-border-card/70 bg-bg-card p-4 shadow-[0_28px_64px_-48px_rgba(15,23,42,0.45)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3 text-sm font-bold text-foreground sm:text-base">
            <span className="rounded-2xl bg-background/80 p-3 dark:bg-white/[0.03]">
              <FunnelSimpleIcon size={18} weight="fill" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span>Filtro</span>
              <span className="text-foreground/35">-</span>
              <span className="text-foreground/65">Filtrar por:</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="text-sm font-semibold text-foreground/60 transition hover:text-foreground"
          >
            Limpar filtros
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              <SpinnerGapIcon size={14} weight="bold" />
              Status
            </span>
            <SelectInput
              label="Status"
              labelClassName="sr-only"
              widthVariant="full"
              disableSort
              isSearchable={false}
              value={status}
              options={[
                { value: "all", label: "Todas as enquetes" },
                ...statuses.map((option) => ({
                  value: option.value,
                  label: option.label,
                })),
              ]}
              onSelectOption={(option) =>
                onStatusChange(option.value as PollStatus | "all")
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
