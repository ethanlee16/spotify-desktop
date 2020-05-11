export interface AuthState {
  loggedIn: boolean;
  currentAccessToken: string;
  refreshToken: string;
}
