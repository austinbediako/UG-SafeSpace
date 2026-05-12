import { IconHourglass } from "@tabler/icons-react";

export default function ComingSoon({
  section,
  title,
  description,
}: {
  section: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          {section}
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">{title}</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">{description}</p>
      </div>

      <div className="flex flex-col items-center justify-center  border border-[#dddad3] bg-white py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center  bg-[#e8eef8] mb-4">
          <IconHourglass className="h-7 w-7 text-[#153D6F]" />
        </div>
        <h2 className="text-base font-semibold text-[#0a1628]">Coming Soon</h2>
        <p className="mt-2 text-sm text-[#6b7a99] max-w-sm">
          This section is under development and will be available before the platform launches.
        </p>
      </div>
    </div>
  );
}
