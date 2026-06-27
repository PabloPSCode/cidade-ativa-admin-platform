import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import type {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
} from "react";
import { forwardRef, useId } from "react";

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Valor do estado da pesquisa */
  search: string;
  /** Funcao para atualizar o valor do estado da pesquisa */
  setSearch: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  /** Funcao a ser executada ao cancelar pesquisa */
  onCancelSearch?: () => void;
  /** Classe opcional para o conteiner externo. */
  containerClassName?: string;
}

/**
 * Campo para pesquisa com funcionalidade de limpar pesquisa.
 */
const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      id,
      search,
      setSearch,
      onCancelSearch,
      className,
      containerClassName,
      placeholder,
      disabled,
      onChange,
      ...rest
    }: SearchInputProps,
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? `search-${reactId}`;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      onChange?.(e);
    };

    const MIN_SEARCH_LENGTH = 3;
    const showClearButton = search.length >= MIN_SEARCH_LENGTH;

    return (
      <div className={clsx("w-full", containerClassName)}>
        <div
          className={clsx(
            "flex w-full items-center gap-3 rounded-sm border border-border-card bg-bg-card p-3",
            disabled && "cursor-not-allowed opacity-70",
            className
          )}
        >
          <div className="flex min-w-0 flex-1 items-center rounded-sm bg-background px-4 py-3 dark:bg-white/[0.06]">
            <input
              id={inputId}
              ref={ref}
              type="text"
              disabled={disabled}
              placeholder={
                placeholder || "Digite um texto para iniciar a pesquisa"
              }
              className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/55 sm:text-base px-4"
              value={search}
              onChange={handleChange}
              {...rest}
            />
          </div>

          {showClearButton ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                onCancelSearch?.();
              }}
              className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary-500 text-white transition hover:bg-primary-600"
              aria-label="Limpar pesquisa"
            >
              <XIcon className="text-lg sm:text-xl" />
            </button>
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary-500 text-white">
              <MagnifyingGlassIcon className="text-xl sm:text-2xl" />
            </span>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
