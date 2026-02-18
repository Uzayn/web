import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbSchema } from "./json-ld";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  const schemaItems = allItems.map((item) => ({
    name: item.label,
    url: `https://winpicks.online${item.href}`,
  }));

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1 text-sm text-text-muted">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                {isLast ? (
                  <span className="text-text-primary font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
