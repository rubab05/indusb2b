import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  name: string;
  imageUrl: string;
  href?: string;
}

export function ProductCard({ name, imageUrl, href = "#" }: ProductCardProps) {
  return (
    <div className="group">
      <div className="aspect-square overflow-hidden bg-gray-50 mb-6">
        <ImageWithFallback 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>
      <h3 className="text-sm tracking-wide mb-4 text-gray-900">{name}</h3>
      <a href={href} className="block w-full py-3 text-center text-xs tracking-widest bg-gray-900 text-white hover:bg-gray-800 transition-colors">
        VIEW PRODUCT
      </a>
    </div>
  );
}