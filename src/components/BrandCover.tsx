import { LogoMark } from "./LogoMark";

/** Category-tinted brand art for blog cards / featured posts — pure CSS, no assets. */

export type BrandCoverCategory = "update" | "product" | "company" | string;

type BrandCoverProps = {
  category: BrandCoverCategory;
  title?: string;
  /** compact = card thumb; hero = featured / post header */
  size?: "compact" | "hero";
  className?: string;
};

const catLabel: Record<string, string> = {
  update: "Update",
  product: "Product",
  company: "Company",
};

export function BrandCover({
  category,
  title,
  size = "compact",
  className = "",
}: BrandCoverProps) {
  const cat = catLabel[category] ?? category;
  const mod = `brand-cover--${category in catLabel ? category : "update"}`;
  const sizeMod = size === "hero" ? "brand-cover--hero" : "brand-cover--compact";

  return (
    <div
      className={`brand-cover ${mod} ${sizeMod} ${className}`.trim()}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title ? `${cat}: ${title}` : undefined}
    >
      <div className="brand-cover__grid" />
      <div className="brand-cover__orb" />
      <div className="brand-cover__orb brand-cover__orb--2" />
      <div className="brand-cover__mark">
        <LogoMark size="100%" />
      </div>
      <span className="brand-cover__cat">{cat}</span>
      <div className="brand-cover__scan" />
    </div>
  );
}

export default BrandCover;
