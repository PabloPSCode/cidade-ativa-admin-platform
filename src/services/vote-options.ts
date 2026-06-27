import api, { type PaginatedResult, type PaginationParams } from "./api";

export interface VoteOptionResponseDTO {
  id: string;
  optionText: string;
  voteId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateVoteOptionDTO {
  optionText: string;
  voteId: string;
}

export interface UpdateVoteOptionDTO {
  optionText?: string;
  voteId?: string;
}

export interface ListVoteOptionsParams extends PaginationParams {
  voteId?: string;
}

export async function createVoteOption(
  data: CreateVoteOptionDTO,
): Promise<VoteOptionResponseDTO> {
  return api.post("/vote-options", data);
}

export async function listVoteOptions(
  params?: ListVoteOptionsParams,
): Promise<PaginatedResult<VoteOptionResponseDTO>> {
  return api.get("/vote-options", { params: { page: 1, perPage: 10, ...params } });
}

export async function getVoteOptionById(
  id: string,
): Promise<VoteOptionResponseDTO> {
  return api.get(`/vote-options/${id}`);
}

export async function updateVoteOption(
  id: string,
  data: UpdateVoteOptionDTO,
): Promise<VoteOptionResponseDTO> {
  return api.put(`/vote-options/${id}`, data);
}

export async function deleteVoteOption(id: string): Promise<void> {
  return api.delete(`/vote-options/${id}`);
}
