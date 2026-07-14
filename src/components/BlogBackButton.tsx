import { Link } from "react-router-dom";

type BlogNavButtonProps = {
  to: string;
  label: string;
  /** arrow on the left (default) or right */
  direction?: "back" | "next";
  className?: string;
  title?: string;
};

function Chevron({ dir }: { dir: "back" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d={dir === "next" ? "M8 4L14 10L8 16" : "M12 4L6 10L12 16"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Launch-styled pill control for blog back / prev / next */
export function BlogBackButton({
  to,
  label,
  direction = "back",
  className = "",
  title,
}: BlogNavButtonProps) {
  return (
    <Link
      to={to}
      className={`blog-back-btn blog-back-btn--${direction}${className ? ` ${className}` : ""}`}
      title={title}
    >
      {direction === "back" && <Chevron dir="back" />}
      <span>{label}</span>
      {direction === "next" && <Chevron dir="next" />}
    </Link>
  );
}
