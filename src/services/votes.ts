import api, { type PaginatedResult, type PaginationParams } from "./api";

export interface VoteResponseDTO {
  id: string;
  title: string;
  description: string;
  pollId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateVoteDTO {
  title: string;
  description: string;
  pollId: string;
  userId: string;
}

export interface UpdateVoteDTO {
  title?: string;
  description?: string;
  pollId?: string;
  userId?: string;
}

export interface ListVotesParams extends PaginationParams {
  pollId?: string;
  userId?: string;
}

export async function createVote(data: CreateVoteDTO): Promise<VoteResponseDTO> {
  return api.post("/votes", data);
}

export async function listVotes(
  params?: ListVotesParams,
): Promise<PaginatedResult<VoteResponseDTO>> {
  return api.get("/votes", { params: { page: 1, perPage: 10, ...params } });
}

export async function getVoteById(id: string): Promise<VoteResponseDTO> {
  return api.get(`/votes/${id}`);
}

export async function updateVote(
  id: string,
  data: UpdateVoteDTO,
): Promise<VoteResponseDTO> {
  return api.put(`/votes/${id}`, data);
}

export async function deleteVote(id: string): Promise<void> {
  return api.delete(`/votes/${id}`);
}
