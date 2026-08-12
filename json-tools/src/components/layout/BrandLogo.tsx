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
          <path
            d="M11.2 10.2c-1.7 1.1-2.7 2.8-2.7 5.8s1 4.7 2.7 5.8l1.1-1.5c-1.2-.8-1.8-2-1.8-4.3s.6-3.5 1.8-4.3l-1.1-1.5zm9.6 0-1.1 1.5c1.2.8 1.8 2 1.8 4.3s-.6 3.5-1.8 4.3l1.1 1.5c1.7-1.1 2.7-2.8 2.7-5.8s-1-4.7-2.7-5.8z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="brand__text">
        JSON <span>Tools</span>
      </span>
    </span>
  );
}
