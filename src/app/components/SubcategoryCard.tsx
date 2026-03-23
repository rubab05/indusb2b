import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SubcategoryCardProps {
  title: string;
  imageUrl: string;
  description: string;
}

export function SubcategoryCard({ title, imageUrl, description }: SubcategoryCardProps) {
  return (
    <a href="#" className="group block bg-white border border-gray-100 hover:border-gray-300 transition-colors">
      <div className="aspect-square overflow-hidden bg-gray-50">
        <ImageWithFallback 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
        <span className="text-xs tracking-widest text-gray-900 group-hover:text-gray-600 transition-colors">
          VIEW RANGE →
        </span>
      </div>
    </a>
  );
}
