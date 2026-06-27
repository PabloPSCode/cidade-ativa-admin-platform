import api from "./api";

export interface NeighborhoodResponseDTO {
  id: string;
  name: string;
  cityName: string;
}

/**
 * Lists the neighborhoods registered in the back-end, optionally filtered by
 * city name. The endpoint returns the full list (not paginated).
 */
export async function listNeighborhoods(
  cityName?: string,
): Promise<NeighborhoodResponseDTO[]> {
  return api.get("/neighborhoods", {
    params: cityName ? { cityName } : undefined,
  });
}
