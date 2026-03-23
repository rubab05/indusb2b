import { ReactNode, useRef } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  children: ReactNode;
  slidesToShow?: number;
}

export function ProductCarousel({ children, slidesToShow = 3 }: ProductCarouselProps) {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, slidesToShow),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="flex gap-2 mb-8 justify-end">
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="w-12 h-12 border border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="w-12 h-12 border border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Carousel */}
      <Slider ref={sliderRef} {...settings}>
        {children}
      </Slider>
    </div>
  );
}
