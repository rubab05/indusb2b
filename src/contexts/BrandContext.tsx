import { createContext, useContext, useEffect } from 'react';
import { brandConfig, BrandConfig } from '../config/brand.config';

interface BrandContextValue {
  brand: BrandConfig;
}

const BrandContext = createContext<BrandContextValue>({ brand: brandConfig });

export function BrandProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', brandConfig.primaryColor);
    root.style.setProperty('--brand-secondary', brandConfig.secondaryColor);
    root.style.setProperty('--brand-accent', brandConfig.accentColor);

    if (brandConfig.faviconUrl) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = brandConfig.faviconUrl;
    }
  }, []);

  return (
    <BrandContext.Provider value={{ brand: brandConfig }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandContextValue {
  return useContext(BrandContext);
}

export type { BrandConfig };
