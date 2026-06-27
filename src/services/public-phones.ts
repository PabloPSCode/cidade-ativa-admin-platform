import api, { type PaginatedResult, type PaginationParams } from "./api";

export interface PublicPhoneResponseDTO {
  id: string;
  institutionName: string;
  phone: string;
}

export interface CreatePublicPhoneDTO {
  institutionName: string;
  phone: string;
}

export interface UpdatePublicPhoneDTO {
  institutionName?: string;
  phone?: string;
}

export async function createPublicPhone(
  data: CreatePublicPhoneDTO,
): Promise<PublicPhoneResponseDTO> {
  return api.post("/public-phones", data);
}

export async function listPublicPhones(
  params?: PaginationParams,
): Promise<PaginatedResult<PublicPhoneResponseDTO>> {
  return api.get("/public-phones", { params: { page: 1, perPage: 10, ...params } });
}

export async function getPublicPhoneById(id: string): Promise<PublicPhoneResponseDTO> {
  return api.get(`/public-phones/${id}`);
}

export async function updatePublicPhone(
  id: string,
  data: UpdatePublicPhoneDTO,
): Promise<PublicPhoneResponseDTO> {
  return api.put(`/public-phones/${id}`, data);
}

export async function deletePublicPhone(id: string): Promise<void> {
  return api.delete(`/public-phones/${id}`);
}
