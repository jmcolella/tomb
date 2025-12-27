export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

export type AuthResult = {
  data: null;
  error: string | null;
};