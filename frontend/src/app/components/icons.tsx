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

export const ContactIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-10 h-10"
      fill="none"
      stroke="#e07a3d"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.48a2 2 0 0 1 2.11-.45c.83.27 1.7.47 2.6.59a2 2 0 0 1 1.72 2z" />
    </svg>
  );
};

export const SearchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10 text-[#e47a3d]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
};

export const NotificationIcon = () => {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-[#e47a3d]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </div>
  );
};

export const EditIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      className="w-6 h-6"
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
      <path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
    </svg>
  );
};

export const DeleteIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-white"
    >
      <path d="M9 3V4H4V6H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6H20V4H15V3H9ZM7 6H17V20H7V6ZM9 8V18H11V8H9ZM13 8V18H15V8H13Z" />
    </svg>
  );
};

export const MapIcon = () => {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
};
