interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = 'w-9 h-9' }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="1"
        y="1"
        width="42"
        height="42"
        rx="12"
        fill="#103329"
        stroke="rgba(226, 245, 236, 0.22)"
        strokeWidth="1.2"
      />
      <path
        d="M12.5 30.5C12.5 19.5 20.5 12 32.5 11.5C31.8 23.2 24.3 31.2 13.2 31.2"
        fill="#18A96B"
        fillOpacity="0.28"
        stroke="#4ADE9B"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 32.5L27 17"
        stroke="#F0FDF7"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18.5 25.5V19.8M22.8 21.2H27.8"
        stroke="#F0FDF7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
