import { ImageWithFallback } from "./figma/ImageWithFallback";

interface VariantCardProps {
  title: string;
  imageUrl: string;
  capacity: string;
  diameter: string;
}

export function VariantCard({ title, imageUrl, capacity, diameter }: VariantCardProps) {
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
        <h3 className="text-lg mb-3 tracking-tight">{title}</h3>
        <div className="space-y-1 mb-4">
          <p className="text-sm text-gray-600">Capacity: {capacity}</p>
          <p className="text-sm text-gray-600">Diameter: {diameter}</p>
        </div>
        <span className="text-xs tracking-widest text-gray-900 group-hover:text-gray-600 transition-colors">
          VIEW DETAILS →
        </span>
      </div>
    </a>
  );
}
