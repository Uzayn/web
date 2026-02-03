import { Sidebar } from "@/components/layout/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 overflow-auto pt-[73px] lg:pt-6">
        {children}
      </main>
    </div>
  );
}
