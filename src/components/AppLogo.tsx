
import React from "react";

interface AppLogoProps {
  className?: string;
}

const LOGO_URL = "https://lfurnhgalbdgecymrmol.supabase.co/storage/v1/object/public/ai-images//LOGO%2002.svg";

export function AppLogo({ className = "" }: AppLogoProps) {
  return (
    <div className={`flex justify-center items-center mb-6 ${className}`}>
      <img
        src={LOGO_URL}
        alt="Logo Meus Investimentos"
        className="h-14 md:h-20 w-auto drop-shadow-lg"
        draggable={false}
        style={{ userSelect: "none" }}
      />
    </div>
  );
}
