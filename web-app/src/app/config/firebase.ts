import { google } from 'googleapis';

export const COLLECTIONS = {
  USERS: 'tid_users'
};

export const GOOGLE_AUTH = {
  CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  REDIRECT_URI: 'postmessage'
};

export function createGoogleAuthClient() {
  return new google.auth.OAuth2(
    GOOGLE_AUTH.CLIENT_ID,
    GOOGLE_AUTH.CLIENT_SECRET,
    GOOGLE_AUTH.REDIRECT_URI
  );
}