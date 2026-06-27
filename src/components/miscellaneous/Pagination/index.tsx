import clsx from "clsx";

interface PaginationProps {
  /** Página atualmente selecionada (1-based). */
  currentPage: number;
  /** Total de páginas disponíveis. */
  totalPages: number;
  /** Disparado quando o usuário seleciona uma nova página. */
  onPageChange: (page: number) => void;
  /** Quantidade máxima de números de página exibidos por vez. */
  pagesToShow?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pagesToShow = 4,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const half = Math.floor(pagesToShow / 2);
  let start = Math.max(1, safePage - half);
  const end = Math.min(totalPages, start + pagesToShow - 1);
  start = Math.max(1, end - pagesToShow + 1);

  const pageNumbers = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );

  return (
    <nav
      className={clsx(
        "flex flex-col gap-3 rounded-[1.75rem] border border-border-card/70 bg-bg-card px-4 py-4 shadow-[0_24px_56px_-40px_rgba(15,23,42,0.45)] sm:flex-row sm:items-center sm:justify-between sm:px-5",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, safePage - 1))}
        disabled={safePage === 1}
        className="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Anterior
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {pageNumbers.map((pageNumber) => {
          const isActive = pageNumber === safePage;
          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={clsx(
                "h-10 w-10 rounded-sm text-sm font-medium transition",
                isActive
                  ? "border border-foreground/15 bg-primary-500 !text-white"
                  : "border border-transparent text-foreground/70 hover:border-foreground/10 hover:bg-foreground/5",
              )}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
        disabled={safePage === totalPages}
        className="min-w-[9rem] rounded-2xl border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Próximo
      </button>
    </nav>
  );
}
