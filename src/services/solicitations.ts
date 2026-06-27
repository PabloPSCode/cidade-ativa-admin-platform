import api, { type PaginatedResult, type PaginationParams } from "./api";

export type SolicitationStatus =
  | "waiting_approval"
  | "not_resolved"
  | "in_progress"
  | "resolved"
  | "unconsidered";

export interface SolicitationResponseDTO {
  id: string;
  protocolNumber: string | null;
  title: string;
  description: string;
  neighborhood: string;
  street: string;
  requestingUserId: string;
  requestingUserName: string;
  solicitationTypeId: string;
  status: SolicitationStatus;
  unsolvedImageUrls: string[];
  solvedImageUrls: string[] | null;
  solvedDate: Date | null;
  solvedCommentary: string | null;
  solvedUserId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateSolicitationDTO {
  title: string;
  description: string;
  neighborhood: string;
  street: string;
  requestingUserId: string;
  solicitationTypeId: string;
  unsolvedImageUrls?: string[];
  protocolNumber?: string;
}

export interface UpdateSolicitationDTO {
  title?: string;
  description?: string;
  neighborhood?: string;
  street?: string;
  status?: SolicitationStatus;
  solvedImageUrls?: string[];
  solvedDate?: Date;
  solvedCommentary?: string;
  solvedUserId?: string;
}

export interface SolveSolicitationDTO {
  solvedImageUrls: string[];
  solvedCommentary?: string;
}

export interface ListSolicitationsParams extends PaginationParams {
  userId?: string;
  status?: SolicitationStatus;
}

export async function createSolicitation(
  data: CreateSolicitationDTO,
): Promise<SolicitationResponseDTO> {
  return api.post("/solicitations", data);
}

export async function listSolicitations(
  params?: ListSolicitationsParams,
): Promise<PaginatedResult<SolicitationResponseDTO>> {
  return api.get("/solicitations", { params: { page: 1, perPage: 10, ...params } });
}

export async function getSolicitationById(
  id: string,
): Promise<SolicitationResponseDTO> {
  return api.get(`/solicitations/${id}`);
}

export async function updateSolicitation(
  id: string,
  data: UpdateSolicitationDTO,
): Promise<SolicitationResponseDTO> {
  return api.put(`/solicitations/${id}`, data);
}

export async function solveSolicitation(
  id: string,
  data: SolveSolicitationDTO,
): Promise<SolicitationResponseDTO> {
  return api.post(`/solicitations/${id}/solve`, data);
}

export async function deleteSolicitation(id: string): Promise<void> {
  return api.delete(`/solicitations/${id}`);
}

/**
 * Approves a solicitation, moving its status to "in_progress".
 */
export async function approveSolicitation(
  id: string,
): Promise<SolicitationResponseDTO> {
  return updateSolicitation(id, { status: "in_progress" });
}

/**
 * Marks a solicitation as "unconsidered". A commentary explaining the decision
 * is required and is persisted as the solicitation's `solvedCommentary`.
 */
export async function unconsiderSolicitation(
  id: string,
  commentary: string,
): Promise<SolicitationResponseDTO> {
  return updateSolicitation(id, {
    status: "unconsidered",
    solvedCommentary: commentary,
  });
}
