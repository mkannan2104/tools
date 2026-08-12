export function BrandLogo({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span className={`brand ${className}`.trim()}>
      <span className="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
          <rect width="32" height="32" rx="8" fill="currentColor" />
          <rect
            x="7"
            y="9"
            width="18"
            height="14"
            rx="2.5"
            stroke="#fff"
            strokeWidth="2"
          />
          <circle cx="12" cy="14" r="1.8" fill="#fff" />
          <path
            d="M7 19.5 12.5 15.5 16.5 18.5 19.5 16.5 25 20.5V21.5a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="brand__text">
        Image <span>Tools</span>
      </span>
    </span>
  );
}
