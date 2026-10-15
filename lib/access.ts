import { Session } from "next-auth";

export function canView(
  visibility: "internal" | "external",
  session: Session | null,
) {
  if (visibility === "external") return true;
  return session?.isMember === true;
}
