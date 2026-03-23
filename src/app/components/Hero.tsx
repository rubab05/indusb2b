interface HeroProps {
  imageUrl: string;
}

export function Hero({ imageUrl }: HeroProps) {
  return (
    <section className="relative h-[75vh] min-h-[600px] bg-gray-900">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative h-full max-w-[1400px] mx-auto px-8 flex items-center">
        <div className="max-w-2xl text-white">
          <div className="text-xs tracking-widest text-white/80 mb-4">B2B WHOLESALE & DROPSHIP PLATFORM</div>
          <h1 className="text-6xl mb-8 tracking-tight leading-tight">
            Household Products<br />for Trade Partners
          </h1>
          <p className="text-xl mb-12 text-white/90 leading-relaxed">
            Join our B2B partner network. Access wholesale pricing, dropship programs, and bulk ordering for quality household products.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide">
              APPLY FOR B2B ACCESS
            </button>
            <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm tracking-wide">
              LOGIN TO VIEW PRICING
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}