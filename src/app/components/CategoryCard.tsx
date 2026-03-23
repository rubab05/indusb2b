import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  productCount?: number;
  href?: string;
  b2bLabel?: string;
}

export function CategoryCard({ title, imageUrl, productCount, href = "#", b2bLabel }: CategoryCardProps) {
  return (
    <a href={href} className="group block relative aspect-[4/5] overflow-hidden bg-gray-100">
      <ImageWithFallback 
        src={imageUrl} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      
      {/* B2B Label */}
      {b2bLabel && (
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-yellow-500 text-gray-900 text-xs tracking-wide">
            {b2bLabel}
          </span>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <h3 className="text-xl mb-2 tracking-wide">{title}</h3>
        {productCount && (
          <p className="text-sm text-white/70 tracking-wide">{productCount} PRODUCTS</p>
        )}
      </div>
    </a>
  );
}