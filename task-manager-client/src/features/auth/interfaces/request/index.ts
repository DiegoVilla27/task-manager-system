interface AuthLoginRequest {
  email: string;
  password: string;
}

interface AuthRegisterRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type { AuthLoginRequest, AuthRegisterRequest };
