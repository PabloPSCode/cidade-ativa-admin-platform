import api, { type PaginatedResult, type PaginationParams } from "./api";

export interface CityResponseDTO {
  id: string;
  name: string;
  /** UF abbreviation (e.g. "MG"). Comes straight from `GET /cities`. */
  uf: string;
  createdAt: Date;
}

export type ListCitiesParams = PaginationParams;

/**
 * Lists the cities registered in the back-end (`GET /cities`). The endpoint is
 * paginated; the UF of each city is exposed via the `uf` field, so the set of
 * available UFs is derived from this list (there is no dedicated UF route).
 */
export async function listCities(
  params?: ListCitiesParams,
): Promise<PaginatedResult<CityResponseDTO>> {
  return api.get("/cities", { params: { page: 1, perPage: 10, ...params } });
}
