// BlogPostIcon.tsx
export const BlogPostIcon = ({
  size = 24,
  className = "text-primary",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="black"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
    >
      <path d="M19 2H5C3.895 2 3 2.895 3 4v16c0 1.105.895 2 2 2h14c1.105 0 2-.895 2-2V4c0-1.105-.895-2-2-2zm0 16H5V4h14v14zM7 6h10v2H7V6zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
    </svg>
  );
};

// EyeIcon.tsx
export const LostIcon = ({
  size = 28,
  className = "text-black",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
      <circle cx={12} cy={11} r={1} />
    </svg>
  );
};

// UnknownLocationPinIcon.tsx
export const UnknownLocationPinIcon = ({
  size = 30,
  className = "text-black",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="black"
      strokeWidth={2}
      width={size}
      height={size}
      className={className}
    >
      {/* Pin base */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z"
      />
      {/* Question mark */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.5 9a2.5 2.5 0 115 0c0 1.5-1 1.75-1.25 2.25-.25.5 0 .75.75 1.75"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
};

// ScheduleClipboardIcon.tsx
export const ScheduleClipboardIcon = ({
  size = 28,
  className = "text-black",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      width={size}
      height={size}
      className={className}
    >
      {/* Clipboard frame */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 2h6a2 2 0 012 2v2h-2V4H9v2H7V4a2 2 0 012-2z"
      />
      <rect x="5" y="6" width="14" height="14" rx="2" ry="2" />
      {/* Lines (list) */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h8M8 14h8M8 18h4"
      />
      {/* Clock */}
      <circle cx="17" cy="17" r="3" />
      <path strokeLinecap="round" d="M17 15v2l1 1" />
    </svg>
  );
};
