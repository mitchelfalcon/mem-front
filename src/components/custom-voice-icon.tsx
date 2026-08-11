import React from "react";

interface CustomMicVoiceIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function CustomMicVoiceIcon({ className = "w-6 h-6", ...props }: CustomMicVoiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      {/* Exactly the two parallel vertical pill bars shown in the design images */}
      {/* Left Pill */}
      <rect x="8" y="4" width="3" height="16" rx="1.5" />
      {/* Right Pill */}
      <rect x="13" y="4" width="3" height="16" rx="1.5" />
    </svg>
  );
}
