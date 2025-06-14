
import React from "react";
import clsx from "clsx";

interface DashboardInfoCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardInfoCard({ children, className }: DashboardInfoCardProps) {
  return (
    <div
      className={clsx(
        "bg-gradient-to-br from-[#22232b] via-[#181922] to-[#22232b] rounded-xl px-5 py-5 md:py-7 min-w-[120px] flex flex-col items-center shadow-[0_2px_18px_0_rgba(23,30,52,0.08)]",
        "transition-colors hover:from-[#2a2b36] hover:to-[#242634]",
        className
      )}
      style={{
        border: "1px solid rgba(204,208,228,0.06)",
        backdropFilter: "blur(4px)",
      }}
    >
      {children}
    </div>
  );
}

