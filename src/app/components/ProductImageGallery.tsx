import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductImageGalleryProps {
  images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex gap-6">
      {/* Thumbnail Column */}
      <div className="flex flex-col gap-4 w-24">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square border-2 overflow-hidden transition-colors ${
              selectedImage === index ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <ImageWithFallback
              src={image}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 aspect-square bg-gray-50 overflow-hidden">
        <ImageWithFallback
          src={images[selectedImage]}
          alt="Main product image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
