import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <Card className="p-12">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-text-muted" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Blog Coming Soon
            </h1>
            <p className="text-text-muted">
              We&apos;re working on bringing you expert betting insights, strategies,
              and analysis. Check back soon!
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
