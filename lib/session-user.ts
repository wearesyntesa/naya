import type { Session } from "next-auth";

export type MenuUser = {
  name: string | null;
  email: string | null;
  image: string | null;
  username: string | null;
};

export function toMenuUser(session: Session | null): MenuUser | null {
  if (!session?.user) return null;
  const { name, email, image } = session.user;
  return {
    name: name ?? null,
    email: email ?? null,
    image: image ?? null,
    username: session.login ?? null,
  };
}
