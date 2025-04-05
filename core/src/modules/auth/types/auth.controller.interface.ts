export interface IAuthController {
  login(body: { email: string; password: string }): Promise<{ token: string }>;
//   logout(): Promise<void>;
}