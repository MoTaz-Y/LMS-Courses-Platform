import { createAuthClient } from 'better-auth/react';
import { emailOTPClient } from 'better-auth/client/plugins';
import { adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: 'http://localhost:3000',
  plugins: [emailOTPClient(), adminClient()],
});

// you can also export specific methods if you prefer:
// export const { useAuth, useUser, useSession, useLogout } = authClient;
