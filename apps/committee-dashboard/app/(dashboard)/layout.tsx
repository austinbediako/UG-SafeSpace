import CommitteeSidebar from "@/components/committee-sidebar";
import { SessionGuard } from "@/components/session-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionGuard />
      <CommitteeSidebar>{children}</CommitteeSidebar>
    </>
  );
}
