export type SolicitationStatus =
  | "not_resolved"
  | "in_progress"
  | "resolved"
  | "unconsidered";

export interface SolicitationSummary {
  id: string;
  protocolNumber: string;
  title: string;
  requestingUserId: string;
  description: string;
  imageUrls: string[];
  neighborhood: string;
  createdAt: string;
  street: string;
  status: SolicitationStatus;
}

export interface SolicitationRecord extends SolicitationSummary {
  mapAddress: string;
  resolutionComment: string;
  resolutionImageUrls: string[];
  resolvedAt?: string;
}
