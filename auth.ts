import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const ORG = "wearesyntesa";

declare module "next-auth" {
  interface Session {
    isMember: boolean;
  }
}

async function isOrgMember(accessToken: string) {
  const res = await fetch(
    `https://api.github.com/user/memberships/orgs/${ORG}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );
  if (!res.ok) return false;
  const membership = (await res.json()) as { state?: string };
  return membership.state === "active";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: "read:user read:org" } },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.isMember = await isOrgMember(account.access_token);
      }
      return token;
    },
    session({ session, token }) {
      session.isMember = token.isMember === true;
      return session;
    },
  },
});
