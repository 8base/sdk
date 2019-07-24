import { WebAuth0AuthClient } from '@8base/react-sdk';

const AUTH0_CLIENT_ID = 'Ix0EkIh6R596Wx4utWXCS4THyWPOKpDp';
const AUTH0_CLIENT_DOMAIN = 'secure.8base.com';
export const AUTH_PROFILE_ID = 'cjxq1j6no00en01mh7gaf8pun';

const REDIRECT_URI = `${document.location.origin}/auth`;

export const authClient = new WebAuth0AuthClient({
  clientId: AUTH0_CLIENT_ID,
  domain: AUTH0_CLIENT_DOMAIN,
  // Don't forget set custom domains in the authentication settings!
  redirectUri: REDIRECT_URI,
  logoutRedirectUri: document.location.origin,
});