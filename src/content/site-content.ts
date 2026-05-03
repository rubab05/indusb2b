import type { SiteContent } from "../lib/content-types";
import { brandConfig } from "../config/brand.config";

export const siteContent: SiteContent = {
  brandName: brandConfig.brandName,
  tagline:
    "We develop and source high quality household products, specifically focused on everyday house items.",
  about:
    `${brandConfig.brandName} develops and sources high quality household products, specifically focused on everyday house items. Our range is built around practical use, accessible design, and category breadth, helping trade buyers source reliable household product lines.`,
  tradeMessage:
    "Join our B2B partner network as a wholesale or dropship partner. Access approved pricing, bulk ordering, and dedicated account management.",
  processSteps: [
    {
      step: "1",
      title: "Apply as a Business",
      description:
        "Submit your company details and choose wholesale or dropship access.",
    },
    {
      step: "2",
      title: "Get Approved by Admin",
      description:
        "Our team reviews and approves your account within 24–48 hours.",
    },
    {
      step: "3",
      title: "Access Pricing & Tools",
      description:
        "View wholesale prices, MOQs, and downloadable price lists.",
    },
    {
      step: "4",
      title: "Place Orders",
      description:
        "Submit wholesale or dropship orders directly through your portal.",
    },
    {
      step: "5",
      title: "Track & Manage",
      description:
        "Monitor orders, invoices, tracking, and support tickets.",
    },
  ],
  benefits: [
    {
      title: "Business Registration & Approval",
      description:
        "Secure account creation with admin approval process. Role-based access for wholesale and dropship partners.",
    },
    {
      title: "Wholesale & Dropship Access",
      description:
        "Choose your business model. Access partner-specific pricing, MOQs, and ordering workflows.",
    },
    {
      title: "MOQ & Bulk Ordering",
      description:
        "Minimum order quantities by product or category. Bulk pricing tiers and volume discounts available.",
    },
    {
      title: "Account Management Portal",
      description:
        "Manage orders, view invoices, track shipments, and access support tickets from your dedicated account area.",
    },
    {
      title: "Downloadable Price Lists",
      description:
        "Access approved wholesale price lists by category. Download spec sheets and product catalogues.",
    },
    {
      title: "Whitelabel-Ready Platform",
      description:
        "Multi-brand and multi-domain architecture. Enterprise-grade system built for scalability.",
    },
  ],
  contact: {
    email: `trade@${brandConfig.domain}`,
    phone: "+44 (0) 1234 567 890",
  },
};