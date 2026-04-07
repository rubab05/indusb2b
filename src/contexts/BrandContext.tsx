import { createContext, useContext, useState } from "react";

export interface BrandConfig {
  brandName: string;
  logoUrl: string;
  logoSecondaryUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  emailHeaderHtml: string;
  invoiceHeaderHtml: string;
  domain: string;
}

interface BrandContextValue {
  brand: BrandConfig;
  updateBrand: (config: Partial<BrandConfig>) => void;
}

const STORAGE_KEY = "homatz_brand_config";

const DEFAULT_BRAND: BrandConfig = {
  brandName: "HOMATZ",
  logoUrl: "",
  logoSecondaryUrl: "",
  faviconUrl: "",
  primaryColor: "#111827",
  secondaryColor: "#6b7280",
  accentColor: "#eab308",
  emailHeaderHtml: "<div style='background:#111827;padding:16px;color:#fff;font-family:sans-serif;letter-spacing:0.1em;'>HOMATZ</div>",
  invoiceHeaderHtml: "<div style='font-family:sans-serif;font-size:24px;letter-spacing:0.1em;'>HOMATZ</div>",
  domain: "homatz.co.uk",
};

function loadBrand(): BrandConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_BRAND, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_BRAND;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig>(loadBrand);

  function updateBrand(config: Partial<BrandConfig>) {
    setBrand((prev) => {
      const updated = { ...prev, ...config };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }

  return (
    <BrandContext.Provider value={{ brand, updateBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return ctx;
}
