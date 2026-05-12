import RespondentSidebar from "@/components/respondent-sidebar";
import { CaseProvider } from "@/context/case-context";
import { SessionGuard } from "@/components/session-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CaseProvider>
      <SessionGuard />
      <RespondentSidebar>{children}</RespondentSidebar>
    </CaseProvider>
  );
}
