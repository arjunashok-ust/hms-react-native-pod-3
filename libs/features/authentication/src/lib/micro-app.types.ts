export type SignInCredentials = { token: string; email: string };

export type AuthenticationMicroAppProps = {
  onSignedIn: (credentials: SignInCredentials) => Promise<void>;
};
