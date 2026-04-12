export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface EmailRegistrationRequestDTO {
  fullname: string;
  email: string;
  password: string;
}

export interface EmailConfirmationRequestDTO {
  email: string;
  code: string;
}

export interface TokenDTO {
  access_token: string;
}

export interface SuccessOperationDTO {
  message: string;
}

export interface JWTPayload {
  sub: number;
  email: string;
  fullname: string;
  is_admin: boolean;
  exp: number;
}