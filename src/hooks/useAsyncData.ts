import {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getErrorMessage, showAlertError } from "@/utils/alerts";

interface UseAsyncDataOptions<TData> {
  /** Value used before the first successful load. */
  initialData: TData;
  /** Fallback message shown via toast when the request fails. */
  errorMessage?: string;
  /** Skip fetching while false (e.g. waiting on a route param). Defaults to true. */
  enabled?: boolean;
  /** Re-run the fetch whenever one of these values changes. */
  deps?: DependencyList;
  /** Reset `data` back to `initialData` when the request fails. Defaults to false. */
  resetOnError?: boolean;
  /** Replace the default error toast with custom handling. */
  onError?: (error: unknown) => void;
}

/**
 * Runs an async fetch on mount (and whenever `deps` change), exposing an
 * `isLoading` flag and the resulting `data`. Handles request cancellation on
 * unmount/dep-change and centralizes the try/catch error toast.
 *
 * `setData` is returned so callers can optimistically update the cached data
 * after a mutation (e.g. removing a deleted item from a list), and `reload`
 * re-runs the fetcher on demand.
 *
 * @example
 * const { data: items, setData: setItems, isLoading } = useAsyncData(
 *   () => listItems().then((r) => r.data),
 *   { initialData: [], errorMessage: "Não foi possível carregar." },
 * );
 */
export function useAsyncData<TData>(
  fetcher: () => Promise<TData>,
  options: UseAsyncDataOptions<TData>,
) {
  const {
    initialData,
    errorMessage = "Não foi possível carregar os dados.",
    enabled = true,
    deps = [],
    resetOnError = false,
    onError,
  } = options;

  const [data, setData] = useState<TData>(initialData);
  const [isLoading, setIsLoading] = useState(enabled);

  // Keep latest closures/values without forcing the fetch effect to re-run on
  // every render — it should only re-run when `deps`/`enabled` change.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const initialDataRef = useRef(initialData);
  initialDataRef.current = initialData;

  const runFetch = useCallback(
    async (isCancelled: () => boolean = () => false) => {
      setIsLoading(true);
      try {
        const result = await fetcherRef.current();
        if (isCancelled()) return undefined;
        setData(result);
        return result;
      } catch (error) {
        if (isCancelled()) return undefined;
        if (resetOnError) setData(initialDataRef.current);
        if (onErrorRef.current) onErrorRef.current(error);
        else showAlertError(getErrorMessage(error, errorMessage));
        return undefined;
      } finally {
        if (!isCancelled()) setIsLoading(false);
      }
    },
    [errorMessage, resetOnError],
  );

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    runFetch(() => cancelled);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const reload = useCallback(() => runFetch(), [runFetch]);

  return { data, setData, isLoading, reload };
}
