import type { CategoryContent } from "../lib/content-types";
import { brandConfig } from "../config/brand.config";

export const categories: CategoryContent[] = [
  {
    slug: "mats-and-rugs",
    name: "Mats & Rugs",
    productCount: 45,
    b2bLabel: "MOQ AVAILABLE",
    description:
      "A practical floorcare and soft furnishing range including entrance mats, hallway runners, shaggy rugs, and recycled chindi rugs. Designed for utility, comfort, and broad household appeal.",
    heroImages: [
      { src: "https://images.unsplash.com/photo-1678637651440-dc1c17da0a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yJTIwbWF0JTIwZW50cmFuY2V8ZW58MXx8fHwxNzczMDE5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Barrier mats" },
      { src: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Hallway runner rug" },
      { src: "https://images.unsplash.com/photo-1768218983339-0415a4ca932d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHJhZyUyMHJ1Z3xlbnwxfHx8fDE3NzMwMTk0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Shaggy rug" },
      { src: "https://images.unsplash.com/photo-1768218983339-0415a4ca932d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHJhZyUyMHJ1Z3xlbnwxfHx8fDE3NzMwMTk0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Chindi rug" },
    ],
    subcategories: [
      {
        title: "Barrier Mats",
        description:
          "Heavy-duty indoor-outdoor mats for entrances, staircases, and commercial spaces.",
        image: "https://images.unsplash.com/photo-1678637651440-dc1c17da0a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yJTIwbWF0JTIwZW50cmFuY2V8ZW58MXx8fHwxNzczMDE5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/barrier-mats",
      },
      {
        title: "Shaggy Rugs",
        description:
          "Soft high-pile rugs for living rooms, bedrooms, kids rooms, and hallways.",
        image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/shaggy-rugs",
      },
      {
        title: "Chindi Rag Rugs",
        description:
          "Fair trade multi-colour recycled cotton rugs with fringed handcrafted finish.",
        image: "https://images.unsplash.com/photo-1768218983339-0415a4ca932d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHJhZyUyMHJ1Z3xlbnwxfHx8fDE3NzMwMTk0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/chindi-rag-rugs",
      },
      {
        title: "Hallway Runner Rugs",
        description:
          "Practical long-format runners for corridors, entryways, and under-counter areas.",
        image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/hallway-runner-rugs",
      },
    ],
    featuredFamilies: [
      {
        title: "Barrier Mats",
        description:
          "Heavy-duty entrance mats with non-slip backing and dirt-trapper function.",
        image: "https://images.unsplash.com/photo-1678637651440-dc1c17da0a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yJTIwbWF0JTIwZW50cmFuY2V8ZW58MXx8fHwxNzczMDE5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/barrier-mats",
        tag: "Multiple variants available",
      },
      {
        title: "Hallway Runner Rugs",
        description:
          "Low-profile runners suited for corridors, kitchens, and entry transitions.",
        image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/hallway-runner-rugs",
        tag: "Trade enquiries welcome",
      },
      {
        title: "Shaggy Rugs",
        description:
          "Soft area rugs with high-pile comfort and broad room suitability.",
        image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/shaggy-rugs",
        tag: "Multiple sizes available",
      },
      {
        title: "Chindi Rag Rugs",
        description:
          "Recycled cotton rugs with colourful handcrafted appeal and strong décor value.",
        image: "https://images.unsplash.com/photo-1768218983339-0415a4ca932d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHJhZyUyMHJ1Z3xlbnwxfHx8fDE3NzMwMTk0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/chindi-rag-rugs",
        tag: "Trade enquiries welcome",
      },
    ],
    bestSellers: [
      {
        title: "Barrier Mats",
        image: "https://images.unsplash.com/photo-1678637651440-dc1c17da0a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yJTIwbWF0JTIwZW50cmFuY2V8ZW58MXx8fHwxNzczMDE5NDI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/barrier-mats",
      },
      {
        title: "Hallway Runner Rugs",
        image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/hallway-runner-rugs",
      },
      {
        title: "Shaggy Rugs",
        image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs/shaggy-rugs",
      },
    ],
    relatedCategories: [
      {
        title: "Kitchen & Household",
        image: "https://images.unsplash.com/photo-1728240257876-dd4fc7398043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHN0b2NrJTIwcG90JTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household",
      },
      {
        title: "Decoration & Seasonal",
        image: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal",
      },
      {
        title: "Garden & Outdoor",
        image: "https://images.unsplash.com/photo-1761311554695-68cfca1f3140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHN1cHBvcnQlMjBzdGlja3N8ZW58MXx8fHwxNzczMDE5NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/garden-and-outdoor",
      },
    ],
    benefits: [
      {
        title: "Practical multi-space use",
        description:
          "Suitable for homes, offices, commercial entrances, corridors, and hallways.",
      },
      {
        title: "Comfort and floor protection",
        description:
          "Combines utility, softness, and décor value across multiple room types.",
      },
      {
        title: "Multiple sizes and colours",
        description:
          "Range supports varied customer needs and merchandising options.",
      },
      {
        title: "Easy-care product family",
        description:
          "Strong emphasis on washable, vacuum-friendly, and daily-use floor products.",
      },
    ],
    sections: [
      {
        type: "ctaStrip",
        title: "Need trade pricing or a Mats & Rugs catalogue?",
        ctas: [
          { label: "Request Quote", variant: "primary" },
          { label: "Download Category Catalogue", variant: "outline" },
        ],
      },
    ],
  },
  {
    slug: "decoration-and-seasonal",
    name: "Decoration & Seasonal Products",
    productCount: 32,
    b2bLabel: "BULK ORDER READY",
    description:
      "Decorative and seasonal home products for everyday ambiance and festive retail periods, including wax burners, candle bridges, and artificial Christmas trees.",
    heroImages: [
      { src: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Wax burner" },
      { src: "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Christmas candle bridge" },
      { src: "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Artificial Christmas tree" },
      { src: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Pencil slim Christmas tree" },
    ],
    subcategories: [
      {
        title: "Wax Burners",
        description:
          "Ceramic and porcelain burners for home fragrance and decorative use.",
        image: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/wax-burners",
      },
      {
        title: "Candle Bridges",
        description:
          "Traditional indoor Christmas lighting décor in natural wood designs.",
        image: "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/christmas-candle-bridges",
      },
      {
        title: "Artificial Christmas Trees",
        description:
          "Decorative seasonal tree ranges in standard and deluxe formats.",
        image: "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/artificial-christmas-trees",
      },
      {
        title: "Pencil Slim Trees",
        description:
          "Space-saving festive trees with slim profile and strong decorative impact.",
        image: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjJjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/pencil-slim-christmas-trees",
      },
    ],
    featuredFamilies: [
      {
        title: "Wax Burners",
        description:
          "Decorative ceramic home fragrance products with giftable appeal.",
        image: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/wax-burners",
        tag: "Giftable range",
      },
      {
        title: "Christmas Candle Bridges",
        description:
          "Battery-powered festive lighting pieces for indoor display and seasonal merchandising.",
        image: "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/christmas-candle-bridges",
        tag: "Seasonal décor",
      },
      {
        title: "Artificial Christmas Trees",
        description:
          "Evergreen festive products for retail periods and display-led selling.",
        image: "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/artificial-christmas-trees",
        tag: "Multiple heights available",
      },
      {
        title: "Pencil Slim Trees",
        description:
          "Space-saving seasonal décor ideal for urban and compact-home environments.",
        image: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjJjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/pencil-slim-christmas-trees",
        tag: "Trade enquiries welcome",
      },
    ],
    bestSellers: [
      {
        title: "Wax Burners",
        image: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/wax-burners",
      },
      {
        title: "Christmas Candle Bridges",
        image: "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/christmas-candle-bridges",
      },
      {
        title: "Artificial Christmas Trees",
        image: "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal/artificial-christmas-trees",
      },
    ],
    relatedCategories: [
      {
        title: "Kitchen & Household",
        image: "https://images.unsplash.com/photo-1728240257876-dd4fc7398043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHN0b2NrJTIwcG90JTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household",
      },
      {
        title: "Mats & Rugs",
        image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs",
      },
      {
        title: "Garden & Outdoor",
        image: "https://images.unsplash.com/photo-1761311554695-68cfca1f3140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHN1cHBvcnQlMjBzdGlja3N8ZW58MXx8fHwxNzczMDE5NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/garden-and-outdoor",
      },
    ],
    benefits: [
      {
        title: "Seasonal and evergreen range",
        description:
          "Supports festive periods while also offering decorative year-round products.",
      },
      {
        title: "Giftability and display appeal",
        description:
          "Strong visual products suited for gifting, seasonal displays, and decorative merchandising.",
      },
      {
        title: "Indoor décor relevance",
        description:
          "Products suited to home atmosphere, festive decoration, and tabletop display.",
      },
      {
        title: "Broad retail compatibility",
        description:
          "Useful for home décor, seasonal, gift, and general merchandise channels.",
      },
    ],
    sections: [
      {
        type: "ctaStrip",
        title:
          "Need trade pricing or a Decoration & Seasonal catalogue?",
        ctas: [
          { label: "Request Quote", variant: "primary" },
          { label: "Download Category Catalogue", variant: "outline" },
        ],
      },
    ],
  },
  {
    slug: "kitchen-and-household",
    name: "Kitchen & Household",
    productCount: 68,
    b2bLabel: "DROPSHIP ELIGIBLE",
    description:
      `Explore ${brandConfig.brandName} cookware, organisers, and household utility products designed around everyday convenience. From stock pots and wok pans to corner racks and drying solutions, this category combines practical function with broad retail appeal.`,
    heroImages: [
      { src: "https://images.unsplash.com/photo-1728240257876-dd4fc7398043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHN0b2NrJTIwcG90JTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Stock pot" },
      { src: "https://images.unsplash.com/photo-1772385953538-2c694ad89d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b2slMjBwYW4lMjBjb29raW5nJTIwYXNpYW58ZW58MXx8fHwxNzczODcwOTg0fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Wok pan" },
      { src: "https://images.unsplash.com/photo-1709406221293-cbbe118fd94d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlJTIwZnJ1aXQlMjBiYXNrZXQlMjBraXRjaGVufGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Fruit basket" },
      { src: "https://images.unsplash.com/photo-1688318375271-b25e13f196ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNoJTIwZHJ5aW5nJTIwcmFjayUyMHBsYXRlfGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Corner plate rack" },
    ],
    subcategories: [
      {
        title: "Stock Pots",
        description: "Durable stock pots in multiple sizes",
        image: "https://images.unsplash.com/photo-1728240257876-dd4fc7398043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHN0b2NrJTIwcG90JTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/stock-pot-4-5l-24cm",
      },
      {
        title: "Woks & Frying Pans",
        description: "Everyday cookware for home kitchens",
        image: "https://images.unsplash.com/photo-1772385953538-2c694ad89d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b2slMjBwYW4lMjBjb29raW5nJTIwYXNpYW58ZW58MXx8fHwxNzczODcwOTg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/wok-pan-glass-lid-32cm",
      },
      {
        title: "Chip Pans",
        description: "Practical deep frying solutions",
        image: "https://images.unsplash.com/photo-1688940738506-acfe9334bf5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwZnJ5ZXIlMjBiYXNrZXQlMjBjb29raW5nfGVufDF8fHx8MTc3Mzg3MDk5MHww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/chip-pan-with-basket",
      },
      {
        title: "Milk Pans",
        description: "Compact saucepans for smaller cooking tasks",
        image: "https://images.unsplash.com/photo-1734193259681-1fd359f63205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMG1pbGslMjBwYW4lMjBzYXVjZXBhbnxlbnwxfHx8fDE3NzM4NzA5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/milk-pot-14cm",
      },
      {
        title: "Egg Poacher Pans",
        description: "Specialty cookware for egg preparation",
        image: "https://images.unsplash.com/photo-1601763969974-52eba0369424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2clMjBwb2FjaGVyJTIwcGFuJTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/egg-poacher-pan",
      },
      {
        title: "Fruit Baskets",
        description: "Decorative and functional countertop baskets",
        image: "https://images.unsplash.com/photo-1709406221293-cbbe118fd94d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlJTIwZnJ1aXQlMjBiYXNrZXQlMjBraXRjaGVufGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/fruit-basket",
      },
      {
        title: "Corner Plate Racks",
        description: "Space-saving kitchen organisers",
        image: "https://images.unsplash.com/photo-1688318375271-b25e13f196ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNoJTIwZHJ5aW5nJTIwcmFjayUyMHBsYXRlfGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/corner-plate-rack",
      },
      {
        title: "Radiator Airers",
        description: "Compact indoor drying solutions",
        image: "https://images.unsplash.com/photo-1599028274529-31020a1fc1f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGVzJTIwZHJ5aW5nJTIwcmFjayUyMHJhZGlhdG9yfGVufDF8fHx8MTc3Mzg3MDk4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/radiator-airers",
      },
      {
        title: "Rotary Dryers",
        description: "Outdoor laundry utility products",
        image: "https://images.unsplash.com/photo-1761551022779-1b09f0762297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RhcnklMjB3YXNoaW5nJTIwbGluZSUyMG91dGRvb3J8ZW58MXx8fHwxNzczODcwOTg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/rotary-dryers",
      },
    ],
    featuredFamilies: [
      {
        title: "Stock Pot 4.5L / 24cm",
        description:
          "Professional-grade stock pot, ideal for soup, stews, pasta, and batch cooking.",
        image: "https://images.unsplash.com/photo-1728240257876-dd4fc7398043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHN0b2NrJTIwcG90JTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/stock-pot-4-5l-24cm",
        tag: "Multiple variants available",
      },
      {
        title: "Wok Pan with Glass Lid 32cm",
        description:
          "Large-capacity wok with tempered glass lid for versatile stir-fry and everyday cooking.",
        image: "https://images.unsplash.com/photo-1772385953538-2c694ad89d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b2slMjBwYW4lMjBjb29raW5nJTIwYXNpYW58ZW58MXx8fHwxNzczODcwOTg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/wok-pan-glass-lid-32cm",
        tag: "Trade enquiries welcome",
      },
      {
        title: "Non Stick Frying Pan 30cm",
        description:
          "Large-format pan with broad hob compatibility and practical daily-use performance.",
        image: "https://images.unsplash.com/photo-1560131324-71022d71ee4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcnlpbmclMjBwYW4lMjBza2lsbGV0JTIwa2l0Y2hlbnxlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/non-stick-frying-pan-30cm",
        tag: "Multiple variants available",
      },
      {
        title: "Corner Plate Rack",
        description:
          "Space-efficient corner design for plates, bowls, mugs, and countertop organisation.",
        image: "https://images.unsplash.com/photo-1688318375271-b25e13f196ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNoJTIwZHJ5aW5nJTIwcmFjayUyMHBsYXRlfGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/corner-plate-rack",
        tag: "Trade enquiries welcome",
      },
      {
        title: "Fruit Basket",
        description:
          "Open wire design for display, air circulation, and decorative countertop merchandising.",
        image: "https://images.unsplash.com/photo-1709406221293-cbbe118fd94d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlJTIwZnJ1aXQlMjJiYXNrZXQlMjJraXRjaGVufGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/fruit-basket",
        tag: "Multiple variants available",
      },
      {
        title: "Radiator Airers",
        description:
          "Practical drying products for compact homes and everyday indoor utility use.",
        image: "https://images.unsplash.com/photo-1599028274529-31020a1fc1f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGVzJTIwZHJ5aW5nJTIwcmFjayUyMHJhZGlhdG9yfGVufDF8fHx8MTc3Mzg3MDk4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/radiator-airers",
        tag: "Bulk order ready",
      },
    ],
    bestSellers: [
      {
        title: "Stock Pot 4.5L / 24cm",
        image: "https://images.unsplash.com/photo-1728240257876-dd4fc7398043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHN0b2NrJTIwcG90JTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/stock-pot-4-5l-24cm",
      },
      {
        title: "Wok Pan with Glass Lid",
        image: "https://images.unsplash.com/photo-1772385953538-2c694ad89d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b2slMjBwYW4lMjJjb29raW5nJTIwYXNpYW58ZW58MXx8fHwxNzczODcwOTg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/wok-pan-glass-lid-32cm",
      },
      {
        title: "Chip Pan with Basket",
        image: "https://images.unsplash.com/photo-1688940738506-acfe9334bf5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwZnJ5ZXIlMjJiYXNrZXQlMjJjb29raW5nfGVufDF8fHx8MTc3Mzg3MDk5MHww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/chip-pan-with-basket",
      },
      {
        title: "Milk Pot 14cm",
        image: "https://images.unsplash.com/photo-1734193259681-1fd359f63205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMG1pbGslMjJwYW4lMjJzYXVjZXBhbnxlbnwxfHx8fDE3NzM4NzA5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/milk-pot-14cm",
      },
      {
        title: "Egg Poacher Pan",
        image: "https://images.unsplash.com/photo-1601763969974-52eba0369424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ2clMjJwb2FjaGVyJTIycGFuJTIyY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/egg-poacher-pan",
      },
      {
        title: "Corner Plate Rack",
        image: "https://images.unsplash.com/photo-1688318375271-b25e13f196ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNoJTIwZHJ5aW5nJTIwcmFjayUyMHBsYXRlfGVufDF8fHx8MTc3Mzg3MDk4NXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household/corner-plate-rack",
      },
    ],
    relatedCategories: [
      {
        title: "Mats & Rugs",
        image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs",
      },
      {
        title: "Decoration & Seasonal",
        image: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal",
      },
      {
        title: "Garden & Outdoor",
        image: "https://images.unsplash.com/photo-1761311554695-68cfca1f3140?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHN1cHBvcnQlMjBzdGlja3N8ZW58MXx8fHwxNzczMDE5NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/garden-and-outdoor",
      },
    ],
    benefits: [
      {
        title: "Everyday household relevance",
        description:
          "Essential products that serve daily needs in every home.",
      },
      {
        title: "Multiple variants and sizes",
        description:
          "Broad selection to suit different customer preferences.",
      },
      {
        title: "Good cross-sell potential",
        description:
          "Complementary products that work well together.",
      },
      {
        title: "Mix of cookware and organisation",
        description:
          "Diverse range covering multiple household needs.",
      },
    ],
    sections: [
      {
        type: "ctaStrip",
        title: "Need trade pricing or a Kitchen & Household catalogue?",
        ctas: [
          { label: "Request Quote", variant: "primary" },
          { label: "Download Category Catalogue", variant: "outline" },
        ],
      },
    ],
  },
  {
    slug: "garden-and-outdoor",
    name: "Garden & Outdoor",
    productCount: 28,
    b2bLabel: "WHOLESALE PRICING",
    description:
      "Functional and decorative outdoor products spanning plant support, privacy screening, bamboo fencing, and garden accents.",
    heroImages: [
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&auto=format&fit=crop&q=80",
        alt: "Bamboo fence screening",
      },
      {
        src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1080&auto=format&fit=crop&q=80",
        alt: "Bamboo canes in garden",
      },
      {
        src: "https://images.unsplash.com/photo-1563514227-cd06f6bba4e3?w=1080&auto=format&fit=crop&q=80",
        alt: "Green garden sticks",
      },
      {
        src: "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=1080&auto=format&fit=crop&q=80",
        alt: "Artificial hedge screening",
      },
    ],
    subcategories: [
      {
        title: "Bamboo Fence Screening",
        description: "Natural bamboo privacy and decorative fencing",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/bamboo-fence-screening",
      },
      {
        title: "Bamboo Canes",
        description: "Natural support for growing gardens",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/bamboo-canes",
      },
      {
        title: "Green Garden Sticks",
        description: "Plant support sticks in multiple sizes",
        image: "https://images.unsplash.com/photo-1563514227-cd06f6bba4e3?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/green-garden-sticks",
      },
      {
        title: "Wooden Garden Stakes",
        description: "Pointed timber stakes for outdoor support use",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/wooden-garden-stakes",
      },
      {
        title: "Artificial Hedge Screening",
        description: "Low-maintenance privacy and decorative screening",
        image: "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/artificial-hedge-screening",
      },
      {
        title: "Gazing Balls",
        description: "Reflective garden accent décor",
        image: "https://images.unsplash.com/photo-1597218868981-1b68e15f0065?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/gazing-balls",
      },
    ],
    featuredFamilies: [
      {
        title: "Bamboo Fence Screening",
        description:
          "Natural bamboo privacy solution for fences, balconies, patios, and decorative outdoor use.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/bamboo-fence-screening",
        tag: "Natural material",
      },
      {
        title: "Bamboo Canes",
        description:
          "Reusable bamboo supports for vegetables, flowers, trellis systems, and general garden use.",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/bamboo-canes",
        tag: "Multiple lengths available",
      },
      {
        title: "Green Garden Sticks",
        description:
          "Coated support sticks that blend into planting and suit both indoor and outdoor use.",
        image: "https://images.unsplash.com/photo-1563514227-cd06f6bba4e3?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/green-garden-sticks",
        tag: "Trade enquiries welcome",
      },
      {
        title: "Artificial Hedge Screening",
        description:
          "UV-resistant privacy screening with realistic conifer look for fences, walls, and terraces.",
        image: "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/artificial-hedge-screening",
        tag: "Low-maintenance range",
      },
      {
        title: "Gazing Balls",
        description:
          "Reflective stainless steel garden décor with premium visual appeal.",
        image: "https://images.unsplash.com/photo-1597218868981-1b68e15f0065?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/gazing-balls",
        tag: "Giftable décor item",
      },
    ],
    bestSellers: [
      {
        title: "Bamboo Canes",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/bamboo-canes",
      },
      {
        title: "Artificial Hedge Screening",
        image: "https://images.unsplash.com/photo-1585974738771-84483dd9f89f?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/artificial-hedge-screening",
      },
      {
        title: "Gazing Balls",
        image: "https://images.unsplash.com/photo-1597218868981-1b68e15f0065?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor/gazing-balls",
      },
    ],
    relatedCategories: [
      {
        title: "Kitchen & Household",
        image: "https://images.unsplash.com/photo-1728240257876-dd4fc7398043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHN0b2NrJTIwcG90JTIwY29va2luZ3xlbnwxfHx8fDE3NzM4NzA5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/kitchen-and-household",
      },
      {
        title: "Decoration & Seasonal",
        image: "https://images.unsplash.com/photo-1609620521372-e774f478d857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NzMwMTk0Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal",
      },
      {
        title: "Toys & Games",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1080&auto=format&fit=crop&q=80",
        href: "/category/toys-and-games",
      },
    ],
    benefits: [
      {
        title: "Practical plant support",
        description:
          "Useful support products for indoor and outdoor gardening.",
      },
      {
        title: "Privacy and screening",
        description:
          "Natural and artificial screening solutions for gardens and terraces.",
      },
      {
        title: "Decorative outdoor accents",
        description:
          "Products that improve outdoor visual appeal and landscape styling.",
      },
      {
        title: "Easy installation",
        description: "Designed for accessible garden and outdoor use.",
      },
    ],
    sections: [
      {
        type: "ctaStrip",
        title: "Need trade pricing or a Garden & Outdoor catalogue?",
        ctas: [
          { label: "Request Quote", variant: "primary" },
          { label: "Download Category Catalogue", variant: "outline" },
        ],
      },
    ],
  },
  {
    slug: "toys-and-games",
    name: "Toys & Games",
    productCount: 15,
    b2bLabel: "MOQ AVAILABLE",
    description:
      "Active play and light fitness products that work across home, school, party, and event use.",
    heroImages: [
      {
        src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1080&auto=format&fit=crop&q=80",
        alt: "Gloss hula hoops",
      },
    ],
    subcategories: [
      {
        title: "Hula Hoops",
        description:
          "Lightweight activity hoops for kids, adults, events, play, dance, and fitness.",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1080&auto=format&fit=crop&q=80",
        href: "/category/toys-and-games/hula-hoops",
      },
    ],
    featuredFamilies: [
      {
        title: "Gloss Hula Hoops",
        description:
          "Bright multicolour hoops for play, exercise, events, and multi-age activity use.",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1080&auto=format&fit=crop&q=80",
        href: "/category/toys-and-games/hula-hoops",
        tag: "Activity & event product",
      },
    ],
    bestSellers: [
      {
        title: "Gloss Hula Hoops",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1080&auto=format&fit=crop&q=80",
        href: "/category/toys-and-games/hula-hoops",
      },
    ],
    relatedCategories: [
      {
        title: "Garden & Outdoor",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1080&auto=format&fit=crop&q=80",
        href: "/category/garden-and-outdoor",
      },
      {
        title: "Decoration & Seasonal",
        image: "https://images.unsplash.com/photo-1585641688967-c12a165291a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXglMjBidXJuZXIlMjBjYW5kbGV8ZW58MXx8fHwxNzczMDE5NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/decoration-and-seasonal",
      },
      {
        title: "Mats & Rugs",
        image: "https://images.unsplash.com/photo-1740168254713-1e8695f89ffe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFnZ3klMjBydWclMjBob21lfGVufDF8fHx8MTc3MzAxOTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
        href: "/category/mats-and-rugs",
      },
    ],
    benefits: [
      {
        title: "Multi-age appeal",
        description:
          "Suitable for both children and adults across play and light fitness use.",
      },
      {
        title: "Events and party use",
        description:
          "Useful for birthdays, schools, events, and recreational activities.",
      },
      {
        title: "Bright merchandising value",
        description:
          "Colourful, visual products that stand out in family and activity categories.",
      },
      {
        title: "Fitness crossover potential",
        description:
          "Bridges toys, movement, and simple exercise accessories.",
      },
    ],
    sections: [
      {
        type: "ctaStrip",
        title: "Need trade pricing or a Toys & Games catalogue?",
        ctas: [
          { label: "Request Quote", variant: "primary" },
          { label: "Download Category Catalogue", variant: "outline" },
        ],
      },
    ],
  },
];