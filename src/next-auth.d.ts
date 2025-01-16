import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }

  interface Account {
    access_token?: string; // Ensure the account type includes this property
  }
}
