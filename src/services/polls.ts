import api, { type PaginatedResult, type PaginationParams } from "./api";

export type PollStatus = "active" | "inactive" | "finished";

export interface PollResponseDTO {
  id: string;
  title: string;
  description: string;
  pollCoverUrl: string;
  startedAt: Date | null;
  finishedAt: Date | null;
  status: PollStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreatePollDTO {
  title: string;
  description: string;
  pollCoverUrl: string;
  startedAt?: Date;
  finishedAt?: Date;
  status?: PollStatus;
}

export interface UpdatePollDTO {
  title?: string;
  description?: string;
  pollCoverUrl?: string;
  startedAt?: Date;
  finishedAt?: Date;
  status?: PollStatus;
}

export interface ListPollsParams extends PaginationParams {
  status?: PollStatus;
}

export async function createPoll(data: CreatePollDTO): Promise<PollResponseDTO> {
  return api.post("/polls", data);
}

export async function listPolls(
  params?: ListPollsParams,
): Promise<PaginatedResult<PollResponseDTO>> {
  return api.get("/polls", { params: { page: 1, perPage: 10, ...params } });
}

export async function getPollById(id: string): Promise<PollResponseDTO> {
  return api.get(`/polls/${id}`);
}

export async function updatePoll(
  id: string,
  data: UpdatePollDTO,
): Promise<PollResponseDTO> {
  return api.put(`/polls/${id}`, data);
}

export async function deletePoll(id: string): Promise<void> {
  return api.delete(`/polls/${id}`);
}
