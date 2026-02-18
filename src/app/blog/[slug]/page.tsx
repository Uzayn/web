import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const title = formatSlug(params.slug);
  const description = `Read our expert analysis on ${title}. Get football betting tips and insights from WinPicks analysts.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://winpicks.online/blog/${params.slug}`,
      type: "article",
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `https://winpicks.online/blog/${params.slug}`,
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: formatSlug(params.slug), href: `/blog/${params.slug}` },
            ]}
          />

          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-text-muted" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Article Coming Soon
            </h1>
            <p className="text-text-muted">
              This blog post is not yet available. Check back soon for more content!
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
