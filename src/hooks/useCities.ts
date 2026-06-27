import { listCities, type CityResponseDTO } from "@/services/cities";
import { getErrorMessage, showAlertError } from "@/utils/alerts";
import { useEffect, useMemo, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Loads every city registered in the back-end (`GET /cities`, paginated) to
 * feed the UF and city select inputs across the app. The back-end has no
 * dedicated UF route, so the available UFs are derived from each city's `uf`
 * field. Exposes `citiesByUf` to build the city select dependent on the
 * selected UF and `cityNameById` to resolve a city's display name from its id.
 */
export function useCities() {
  const [cities, setCities] = useState<CityResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAllCities() {
      setIsLoading(true);
      try {
        const all: CityResponseDTO[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const result = await listCities({ page, perPage: 100 });
          if (cancelled) return;
          all.push(...result.data);
          totalPages = result.meta.totalPages;
          page += 1;
        } while (page <= totalPages);

        if (!cancelled) setCities(all);
      } catch (error) {
        if (!cancelled) {
          setCities([]);
          showAlertError(
            getErrorMessage(error, "Não foi possível carregar as cidades."),
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAllCities();
    return () => {
      cancelled = true;
    };
  }, []);

  // Unique UFs (e.g. "MG", "SP") derived from the cities.
  const ufOptions: SelectOption[] = useMemo(() => {
    const ufs = Array.from(new Set(cities.map((city) => city.uf)));
    return ufs
      .sort((a, b) => a.localeCompare(b))
      .map((uf) => ({ value: uf, label: uf }));
  }, [cities]);

  /** Cities of a given UF, ready for the `SelectInput`. */
  function citiesByUf(uf: string): SelectOption[] {
    if (!uf) return [];
    return cities
      .filter((city) => city.uf === uf)
      .map((city) => ({ value: city.id, label: city.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  /** Resolves a city's display name from its id (used in the submit payload). */
  function cityNameById(cityId: string): string | undefined {
    return cities.find((city) => city.id === cityId)?.name;
  }

  return { cities, ufOptions, citiesByUf, cityNameById, isLoading };
}
