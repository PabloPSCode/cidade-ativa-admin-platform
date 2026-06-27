import api from "./api";

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface AuthenticateUserResponseDTO {
  token: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  isCouncilman?: boolean;
  isAdmin?: boolean;
  address: string;
  neighborhood: string;
  /** Tenant (city) selected on sign-up — defines the user's `cityId`. */
  cityId?: string;
  /** Display name of the selected city. */
  city?: string;
  /** UF abbreviation of the selected city (e.g. "MG"). */
  uf?: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  isCouncilman: boolean;
  isAdmin: boolean;
  address: string;
  neighborhood: string;
  createdAt: Date;
}

export async function authenticate(
  data: AuthenticateUserDTO,
): Promise<AuthenticateUserResponseDTO> {
  return api.post("/authenticate", data);
}

export async function registerUser(data: CreateUserDTO): Promise<UserResponseDTO> {
  return api.post("/users", data);
}

export async function authenticateWithGoogle(
  email: string,
): Promise<AuthenticateUserResponseDTO> {
  return api.post("/authenticate-google", { email });
}
