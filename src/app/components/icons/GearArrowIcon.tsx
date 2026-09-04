export const GearArrowIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gear outline */}
      <path
        d="M12 2L14.5 4.5L17.5 4L18.5 6.5L21 8L20.5 11L22 13L20.5 15L21 18L18.5 19.5L17.5 22L14.5 21.5L12 24L9.5 21.5L6.5 22L5.5 19.5L3 18L3.5 15L2 13L3.5 11L3 8L5.5 6.5L6.5 4L9.5 4.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrow inside */}
      <path
        d="M8 12H16M16 12L13 9M16 12L13 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
