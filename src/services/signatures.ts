import api from "./api";

export interface SolicitationSignatureResponseDTO {
  id: string;
  imageUrl: string;
  userName: string;
  userId: string;
  solicitationId: string;
  createdAt: Date;
}

export async function listSignaturesBySolicitation(
  solicitationId: string,
): Promise<SolicitationSignatureResponseDTO[]> {
  return api.get(`/signatures/solicitation/${solicitationId}`);
}
