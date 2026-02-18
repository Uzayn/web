interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface SportsEventSchemaProps {
  homeTeam: string;
  awayTeam: string;
  date: string;
  description: string;
  url: string;
}

export function SportsEventSchema({
  homeTeam,
  awayTeam,
  date,
  description,
  url,
}: SportsEventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${homeTeam} vs ${awayTeam}`,
    startDate: date,
    description,
    url,
    homeTeam: {
      "@type": "SportsTeam",
      name: homeTeam,
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: awayTeam,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleSchemaProps {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

export function ArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "WinPicks",
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "WinPicks",
      url: "https://winpicks.online",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
