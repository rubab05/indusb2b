import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Breadcrumbs } from "./Breadcrumbs";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ContentPageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
}

export function ContentPage({ title, subtitle, breadcrumbs, children }: ContentPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {breadcrumbs && (
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-[1400px] mx-auto px-8 py-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
      )}
      <section className="py-16 bg-gray-900">
        <div className="max-w-[1400px] mx-auto px-8">
          <h1 className="text-5xl tracking-tight text-white">{title}</h1>
          {subtitle && (
            <p className="mt-4 text-lg text-gray-300 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
        </div>
      </section>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
