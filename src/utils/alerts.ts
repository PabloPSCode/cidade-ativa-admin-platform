import toast from "react-hot-toast";

/**
 * Extracts a friendly, user-facing message from an error.
 *
 * Errors that reach the UI are normalized by the API response interceptor
 * (see `src/services/api.ts`) into an `Error` whose `message` holds the
 * server's friendly `MSG.message`. This helper surfaces that message and
 * falls back to a contextual default when no server message is available.
 */
const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message.trim().length > 0
    ? error.message
    : fallback;

const showAlertError = (msg: string) =>
  toast.error(msg, {
    style: {
      fontSize: "13px",
    },
  });

const showAlertSuccess = (msg: string) =>
  toast.success(msg, {
    style: {
      fontSize: "13px",
    },
  });

const showAlertLoading = (msg: string) =>
  toast.loading(msg, {
    style: {
      fontSize: "13px",
    },
  });

export { getErrorMessage, showAlertError, showAlertLoading, showAlertSuccess };
