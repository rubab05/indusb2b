import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FeaturedProductCardProps {
  title: string;
  imageUrl: string;
  description: string;
  tag?: string;
  href?: string;
}

export function FeaturedProductCard({ title, imageUrl, description, tag, href = "#" }: FeaturedProductCardProps) {
  return (
    <div className="group bg-white border border-gray-100 hover:border-gray-300 transition-colors">
      <div className="aspect-square overflow-hidden bg-gray-50">
        <ImageWithFallback 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
        {tag && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-gray-100 text-xs tracking-wide text-gray-700">
              {tag}
            </span>
          </div>
        )}
        <a href={href} className="block w-full py-3 text-center text-xs tracking-widest bg-gray-900 text-white hover:bg-gray-800 transition-colors">
          VIEW PRODUCT FAMILY
        </a>
      </div>
    </div>
  );
}