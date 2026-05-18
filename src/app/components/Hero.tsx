import { Link } from "react-router";
interface HeroProps {
  imageUrl: string;
}

export function Hero({ imageUrl }: HeroProps) {
  return (
    <section className="relative h-[60vh] md:h-[75vh] min-h-[400px] md:min-h-[600px] bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative h-full max-w-[1400px] mx-auto px-4 md:px-8 flex items-center">
        <div className="max-w-2xl text-white">
          <div className="text-xs tracking-widest text-white/80 mb-3 md:mb-4">B2B WHOLESALE & DROPSHIP PLATFORM</div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl mb-4 md:mb-8 tracking-tight leading-tight">
            Household Products<br />for Trade Partners
          </h1>
          <p className="text-base sm:text-xl mb-8 md:mb-12 text-white/90 leading-relaxed">
            Join our B2B partner network. Access wholesale pricing, dropship programs, and bulk ordering for quality household products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link to="/apply" className="px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide text-center">
              APPLY FOR B2B ACCESS
            </Link>
            <Link to="/login" className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm tracking-wide text-center">
              LOGIN TO VIEW PRICING
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
