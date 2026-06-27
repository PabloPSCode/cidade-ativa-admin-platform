import { listNeighborhoods } from "@/services/neighborhoods";
import { getErrorMessage, showAlertError } from "@/utils/alerts";
import { useEffect, useState } from "react";

/**
 * Loads the neighborhood names from the back-end (`GET /neighborhoods`) to feed
 * neighborhood select inputs across the app. Returns the de-duplicated, sorted
 * list of names plus a loading flag.
 */
export function useNeighborhoods(cityName?: string) {
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchNeighborhoods() {
      setIsLoading(true);
      try {
        const result = await listNeighborhoods(cityName);
        if (cancelled) return;
        const names = Array.from(new Set(result.map((item) => item.name))).sort(
          (a, b) => a.localeCompare(b),
        );
        setNeighborhoods(names);
      } catch (error) {
        if (!cancelled) {
          setNeighborhoods([]);
          showAlertError(
            getErrorMessage(error, "Não foi possível carregar os bairros."),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchNeighborhoods();
    return () => {
      cancelled = true;
    };
  }, [cityName]);

  return { neighborhoods, isLoading };
}
