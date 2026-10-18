import { auth } from "@/auth";
import { canView } from "@/lib/access";
import { reader } from "@/lib/reader";
import { toMenuUser } from "@/lib/session-user";
import { SidebarNav, type SidebarDoc } from "./sidebar-nav";

export async function Sidebar() {
  const [session, all] = await Promise.all([
    auth(),
    reader.collections.docs.all(),
  ]);

  const docs: SidebarDoc[] = all
    .filter(({ entry }) => canView(entry.visibility, session))
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title || slug,
      visibility: entry.visibility,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return <SidebarNav docs={docs} user={toMenuUser(session)} />;
}
