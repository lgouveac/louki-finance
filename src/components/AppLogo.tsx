
import React from "react";

interface AppLogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const LOGO_URL = "https://neompzltxilcimodyvpd.supabase.co/storage/v1/object/public/flou//logo%20circle2.svg";

export function AppLogo({ className = "", size = "large" }: AppLogoProps) {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-10 w-10", 
    large: "h-14 md:h-20 w-auto"
  };

  const containerClasses = size === "large" ? "flex justify-center items-center mb-6" : "flex items-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <img
        src={LOGO_URL}
        alt="Logo Meus Investimentos"
        className={`${sizeClasses[size]} drop-shadow-lg`}
        draggable={false}
        style={{ userSelect: "none" }}
      />
    </div>
  );
}
