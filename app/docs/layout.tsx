import { Sidebar } from "@/components/sidebar";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="z-20 flex w-full flex-1 self-stretch">
      <Sidebar />
      <div className="min-w-0 flex-1 px-6 pb-10 pt-20 md:px-10 md:pt-10">{children}</div>
    </div>
  );
}
