export type CTA = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "dark" | "light";
};

export type ImageItem = {
  src: string;
  alt: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BenefitCard = {
  title: string;
  description: string;
  icon?: string;
};

export type LinkCard = {
  title: string;
  description?: string;
  image?: string;
  href?: string;
  tag?: string;
};

export type SpecRow = {
  variant?: string;
  size?: string;
  diameter?: string;
  capacity?: string;
  material?: string;
  compatibility?: string;
  lidIncluded?: string;
  finish?: string;
  dimensions?: string;
  useCase?: string;
  [key: string]: string | undefined;
};

export type PageSection =
  | {
      type: "hero";
      title: string;
      subtitle?: string;
      description?: string;
      images?: ImageItem[];
      ctas?: CTA[];
      eyebrow?: string;
    }
  | {
      type: "intro";
      text: string;
    }
  | {
      type: "subcategoryGrid";
      title: string;
      items: LinkCard[];
    }
  | {
      type: "featuredFamilies";
      title: string;
      items: LinkCard[];
    }
  | {
      type: "benefits";
      title: string;
      items: BenefitCard[];
    }
  | {
      type: "bestSellers";
      title: string;
      items: LinkCard[];
    }
  | {
      type: "specTable";
      title: string;
      rows: SpecRow[];
    }
  | {
      type: "richText";
      title?: string;
      content: string[];
    }
  | {
      type: "variants";
      title: string;
      items: LinkCard[];
    }
  | {
      type: "relatedProducts";
      title: string;
      items: LinkCard[];
    }
  | {
      type: "relatedCategories";
      title: string;
      items: LinkCard[];
    }
  | {
      type: "ctaStrip";
      title: string;
      description?: string;
      ctas: CTA[];
    }
  | {
      type: "enquiry";
      title: string;
      description?: string;
    }
  | {
      type: "support";
      title: string;
      description?: string;
      ctas?: CTA[];
    };

export type CategoryContent = {
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  heroImages?: ImageItem[];
  subcategories: LinkCard[];
  featuredFamilies: LinkCard[];
  bestSellers?: LinkCard[];
  relatedCategories?: LinkCard[];
  benefits?: BenefitCard[];
  sections?: PageSection[];
};

export type ProductFamilyContent = {
  slug: string;
  categorySlug: string;
  name: string;
  shortName?: string;
  description: string;
  summary: string;
  seoTitle?: string;
  seoDescription?: string;
  gallery: ImageItem[];
  features: string[];
  useCases?: string[];
  variants?: LinkCard[];
  specifications?: SpecRow[];
  relatedProducts?: LinkCard[];
  relatedCategories?: LinkCard[];
  support?: {
    title: string;
    description: string;
    ctas?: CTA[];
  };
  sections?: PageSection[];
};

export type SiteContent = {
  brandName: string;
  tagline: string;
  about: string;
  tradeMessage: string;
  processSteps: {
    step: string;
    title: string;
    description: string;
  }[];
  benefits: BenefitCard[];
  contact: {
    email: string;
    phone: string;
  };
};