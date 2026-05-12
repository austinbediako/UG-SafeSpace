import {
  IconCheck,
  IconClockHour4,
  IconAlertTriangle,
  IconLock,
} from "@tabler/icons-react";

type StageStatus = "complete" | "active" | "upcoming";

const stages: {
  title: string;
  description: string;
  date: string | null;
  deadline: string | null;
  daysLeft: number | null;
  status: StageStatus;
}[] = [
  {
    title: "Report Submitted",
    description: "The complainant formally filed a report through the Reporting Portal.",
    date: "5 May 2026",
    deadline: null,
    daysLeft: null,
    status: "complete",
  },
  {
    title: "Committee Acknowledgement",
    description: "The Anti-Sexual Harassment Committee acknowledged receipt of the complaint.",
    date: "7 May 2026",
    deadline: "5 working days from submission",
    daysLeft: null,
    status: "complete",
  },
  {
    title: "Respondent Notification",
    description: "You were formally notified of the complaint and your obligations under the policy.",
    date: "7 May 2026",
    deadline: "7 working days from submission",
    daysLeft: null,
    status: "complete",
  },
  {
    title: "Respondent Response",
    description: "Submit your formal written response to the committee.",
    date: null,
    deadline: "16 May 2026",
    daysLeft: 5,
    status: "active",
  },
  {
    title: "Investigation Assigned",
    description: "The committee assigns an investigator to manage the case.",
    date: null,
    deadline: "Follows after your response",
    daysLeft: null,
    status: "upcoming",
  },
  {
    title: "Investigation In Progress",
    description: "The investigator conducts interviews, reviews evidence, and compiles findings.",
    date: null,
    deadline: "60 working days from assignment",
    daysLeft: null,
    status: "upcoming",
  },
  {
    title: "Hearing Scheduled",
    description: "A formal hearing is scheduled with all relevant parties.",
    date: null,
    deadline: "Following investigation",
    daysLeft: null,
    status: "upcoming",
  },
  {
    title: "Decision Rendered",
    description: "The committee issues its formal decision on the case.",
    date: null,
    deadline: null,
    daysLeft: null,
    status: "upcoming",
  },
];

const statusConfig: Record<StageStatus, { icon: React.ReactNode; ring: string; dot: string; label: string; labelColor: string }> = {
  complete: {
    icon: <IconCheck className="h-4 w-4 text-white" />,
    ring: "bg-[#153D6F]",
    dot: "bg-[#153D6F]",
    label: "Completed",
    labelColor: "text-[#153D6F] bg-[#e8eef8]",
  },
  active: {
    icon: <IconClockHour4 className="h-4 w-4 text-white" />,
    ring: "bg-amber-500",
    dot: "bg-amber-500",
    label: "Action Required",
    labelColor: "text-amber-700 bg-amber-100",
  },
  upcoming: {
    icon: <IconLock className="h-4 w-4 text-[#6b7a99]" />,
    ring: "bg-[#dddad3]",
    dot: "bg-[#dddad3]",
    label: "Upcoming",
    labelColor: "text-[#6b7a99] bg-[#f0ede6]",
  },
};

export default function DeadlinesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">

      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Case Ref: UG-2024-0041
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Case Timeline & Deadlines</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          All policy-mandated stages and deadlines for your case. Deadlines are calculated in Ghanaian working days.
        </p>
      </div>

      {/* Active deadline banner */}
      <div className="flex items-start gap-3  border border-amber-200 bg-[#fdf5e0] p-4">
        <IconAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6f1a]" />
        <div>
          <p className="text-sm font-semibold text-[#0a1628]">
            Your response is due in 5 working days — 16 May 2026
          </p>
          <p className="mt-0.5 text-sm text-[#2d3f5e]">
            Failure to submit a response may result in the investigation proceeding without your
            account of events. You may still request a documented extension through the committee.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Timeline */}
        <div className="col-span-2  border border-[#dddad3] bg-white p-6">
          <h2 className="text-base font-semibold text-[#0a1628] mb-6">Case Stages</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-[#dddad3]" />

            <div className="space-y-0">
              {stages.map((stage, idx) => {
                const config = statusConfig[stage.status];
                return (
                  <div key={idx} className="relative flex gap-5 pb-8 last:pb-0">
                    {/* Stage dot */}
                    <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center  ${config.ring}`}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className={`text-sm font-semibold ${stage.status === "upcoming" ? "text-[#6b7a99]" : "text-[#0a1628]"}`}>
                          {stage.title}
                        </p>
                        <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5  ${config.labelColor}`}>
                          {config.label}
                        </span>
                        {stage.daysLeft !== null && (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5  bg-red-50 text-red-600">
                            {stage.daysLeft} days left
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed mb-2 ${stage.status === "upcoming" ? "text-[#6b7a99]" : "text-[#2d3f5e]"}`}>
                        {stage.description}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {stage.date && (
                          <p className="text-xs text-[#6b7a99]">
                            <span className="font-medium text-[#0a1628]">Completed:</span> {stage.date}
                          </p>
                        )}
                        {stage.deadline && (
                          <p className="text-xs text-[#6b7a99]">
                            <span className="font-medium text-[#0a1628]">Deadline:</span> {stage.deadline}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="flex flex-col gap-4">
          <div className=" border border-[#dddad3] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-5 rounded bg-[#c8962b]" />
              <h2 className="text-sm font-semibold text-[#0a1628]">Deadline Summary</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Case Opened", value: "5 May 2026", color: "text-[#0a1628]" },
                { label: "Notification Issued", value: "7 May 2026", color: "text-[#0a1628]" },
                { label: "Your Response Due", value: "16 May 2026", color: "text-amber-700 font-semibold" },
                { label: "Max Investigation", value: "60 working days", color: "text-[#6b7a99]" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between border-b border-[#dddad3] pb-3 last:border-0">
                  <span className="text-xs text-[#6b7a99]">{label}</span>
                  <span className={`text-xs ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className=" border border-[#dddad3] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#153D6F] mb-2">
              Extension Policy
            </p>
            <p className="text-xs text-[#6b7a99] leading-relaxed">
              If you require additional time to submit your response, contact the Committee
              Secretariat before the deadline. Extensions must be formally requested, documented,
              and approved by a Committee Administrator.
            </p>
            <p className="mt-3 text-xs font-medium text-[#0a1628]">
              Committee Secretariat: +233 302 213 870
            </p>
          </div>

          <div className=" border border-[#dddad3] bg-white p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-3 w-3  bg-[#153D6F]" />
              <span className="text-xs text-[#2d3f5e]">Completed stage</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-3 w-3  bg-amber-500" />
              <span className="text-xs text-[#2d3f5e]">Action required</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3  bg-[#dddad3]" />
              <span className="text-xs text-[#2d3f5e]">Upcoming stage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
