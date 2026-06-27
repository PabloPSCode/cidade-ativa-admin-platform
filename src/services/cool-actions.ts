import api, { type PaginatedResult, type PaginationParams } from "./api";

export type CoolActionCategory =
  | "LIMPEZA_URBANA"
  | "MEIO_AMBIENTE"
  | "EDUCACAO"
  | "BEM_ESTAR_ANIMAL"
  | "ZELADORIA"
  | "SEGURANCA_COMUNITARIA"
  | "ENGAJAMENTO_COMUNITARIO";

export interface CoolActionResponseDTO {
  id: string;
  title: string;
  category: CoolActionCategory;
  points: number;
  createdAt: Date;
}

export interface CreateCoolActionDTO {
  title: string;
  category: CoolActionCategory;
  points: number;
}

export interface UpdateCoolActionDTO {
  title?: string;
  category?: CoolActionCategory;
  points?: number;
}

export async function createCoolAction(
  data: CreateCoolActionDTO,
): Promise<CoolActionResponseDTO> {
  return api.post("/cool-actions", data);
}

export async function listCoolActions(
  params?: PaginationParams,
): Promise<PaginatedResult<CoolActionResponseDTO>> {
  return api.get("/cool-actions", { params: { page: 1, perPage: 10, ...params } });
}

export async function getCoolActionById(id: string): Promise<CoolActionResponseDTO> {
  return api.get(`/cool-actions/${id}`);
}

export async function updateCoolAction(
  id: string,
  data: UpdateCoolActionDTO,
): Promise<CoolActionResponseDTO> {
  return api.put(`/cool-actions/${id}`, data);
}

export async function deleteCoolAction(id: string): Promise<void> {
  return api.delete(`/cool-actions/${id}`);
}
