import { useCallback, useRef, useState } from "react";
import { getErrorMessage, showAlertError } from "@/utils/alerts";

interface UseAsyncActionOptions {
  /** Fallback message shown via toast when the action throws. */
  errorMessage?: string;
  /**
   * When false, the error is re-thrown to the caller instead of being shown as
   * a toast (useful when the caller wants custom handling). Defaults to true.
   */
  showErrorAlert?: boolean;
}

/**
 * Wraps an async action (create/update/delete/approve/etc.) with an `isPending`
 * flag so callers can disable buttons while the request is in flight, and
 * centralizes the try/catch error toast.
 *
 * Re-entrant calls are ignored while a previous call is still pending, which
 * guards against double submissions even before React re-renders the disabled
 * button.
 *
 * @example
 * const { run: handleDelete, isPending } = useAsyncAction(
 *   async () => {
 *     await deleteThing(id);
 *     showAlertSuccess("Removido com sucesso.");
 *   },
 *   { errorMessage: "Não foi possível remover." },
 * );
 * // <button onClick={handleDelete} disabled={isPending}>...</button>
 */
export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
  options: UseAsyncActionOptions = {},
) {
  const {
    errorMessage = "Não foi possível concluir a ação.",
    showErrorAlert = true,
  } = options;

  const [isPending, setIsPending] = useState(false);
  const pendingRef = useRef(false);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      if (pendingRef.current) return undefined;
      pendingRef.current = true;
      setIsPending(true);
      try {
        return await action(...args);
      } catch (error) {
        if (!showErrorAlert) throw error;
        showAlertError(getErrorMessage(error, errorMessage));
        return undefined;
      } finally {
        pendingRef.current = false;
        setIsPending(false);
      }
    },
    [action, errorMessage, showErrorAlert],
  );

  return { run, isPending };
}
