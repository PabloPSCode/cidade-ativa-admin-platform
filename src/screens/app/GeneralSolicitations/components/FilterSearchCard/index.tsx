import {
  ArrowsDownUpIcon,
  FunnelSimpleIcon,
  MapPinIcon,
  SpinnerGapIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { SelectInput } from "@/components/inputs/SelectInput";
import clsx from "clsx";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { SolicitationStatus } from "../../constants/solicitations";
import SearchInput from "../SearchInput";

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
  requestingUsers: Array<{ id: string; name: string }>;
  onRequestingUserIdChange: (value: string) => void;
  dateOrder: "recent" | "oldest";
  onDateOrderChange: (value: "recent" | "oldest") => void;
  onResetFilters: () => void;
  showRequestingUserFilter?: boolean;
  className?: string;
}

const SEARCH_SCROLL_DELAY_MS = 2000;
const SEARCH_RESULTS_SECTION_ID = "solicitacoes-listagem";

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
  showRequestingUserFilter = true,
  className,
}: FilterSearchCardProps) {
  useEffect(() => {
    if (search.trim().length === 0) return;

    const timeoutId = window.setTimeout(() => {
      document
        .getElementById(SEARCH_RESULTS_SECTION_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, SEARCH_SCROLL_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  return (
    <section
      className={clsx(
        "filter-search-card Container flex flex-col gap-4",
        className
      )}
    >
      <SearchInput
        search={search}
        setSearch={setSearch}
        placeholder="Pesquise por uma situação ou bairro"
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
              <span className="text-foreground/65">Ordenar por:</span>
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

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              <MapPinIcon size={14} weight="fill" />
              Bairro
            </span>
            <SelectInput
              label="Bairro"
              labelClassName="sr-only"
              widthVariant="full"
              disableSort
              isSearchable
              value={neighborhood}
              options={[
                { value: "all", label: "Todos os bairros" },
                ...neighborhoods.map((option) => ({
                  value: option,
                  label: option,
                })),
              ]}
              onSelectOption={(option) =>
                onNeighborhoodChange(String(option.value))
              }
            />
          </div>

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
                { value: "all", label: "Todos os status" },
                ...statuses.map((option) => ({
                  value: option.value,
                  label: option.label,
                })),
              ]}
              onSelectOption={(option) =>
                onStatusChange(option.value as SolicitationStatus | "all")
              }
            />
          </div>

          {showRequestingUserFilter && (
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                <UserCircleIcon size={14} weight="fill" />
                Requerente
              </span>
              <SelectInput
                label="Requerente"
                labelClassName="sr-only"
                widthVariant="full"
                disableSort
                isSearchable
                value={requestingUserId}
                options={[
                  { value: "all", label: "Todos os requerentes" },
                  ...requestingUsers.map((option) => ({
                    value: option.id,
                    label: option.name,
                  })),
                ]}
                onSelectOption={(option) =>
                  onRequestingUserIdChange(String(option.value))
                }
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
              <ArrowsDownUpIcon size={14} weight="bold" />
              Data da solicitação
            </span>
            <SelectInput
              label="Data da solicitação"
              labelClassName="sr-only"
              widthVariant="full"
              disableSort
              isSearchable={false}
              value={dateOrder}
              options={[
                { value: "recent", label: "Mais recentes" },
                { value: "oldest", label: "Mais antigas" },
              ]}
              onSelectOption={(option) =>
                onDateOrderChange(option.value as "recent" | "oldest")
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
