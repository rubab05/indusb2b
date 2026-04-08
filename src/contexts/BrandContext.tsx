import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api-client';

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
  updateBrand: (config: Partial<BrandConfig>) => Promise<void>;
}

const STORAGE_KEY = 'homatz_brand_config';

const DEFAULT_BRAND: BrandConfig = {
  brandName: 'HOMATZ',
  logoUrl: '',
  logoSecondaryUrl: '',
  faviconUrl: '',
  primaryColor: '#111827',
  secondaryColor: '#6b7280',
  accentColor: '#eab308',
  emailHeaderHtml:
    "<div style='background:#111827;padding:16px;color:#fff;font-family:sans-serif;letter-spacing:0.1em;'>HOMATZ</div>",
  invoiceHeaderHtml:
    "<div style='font-family:sans-serif;font-size:24px;letter-spacing:0.1em;'>HOMATZ</div>",
  domain: 'homatz.co.uk',
};

function loadLocalBrand(): BrandConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_BRAND, ...JSON.parse(stored) };
  } catch {
    // ignore parse errors
  }
  return DEFAULT_BRAND;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig>(loadLocalBrand);

  useEffect(() => {
    const token = localStorage.getItem('homatz_auth_token');
    if (!token) return;
    api
      .get<BrandConfig>('/admin/brand')
      .then((config) => {
        setBrand({ ...DEFAULT_BRAND, ...config });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch {
          // ignore storage errors
        }
      })
      .catch(() => {
        // Not admin or brand endpoint unavailable — keep local/default brand
      });
  }, []);

  async function updateBrand(config: Partial<BrandConfig>) {
    const updated = { ...brand, ...config };
    const saved = await api.put<BrandConfig>('/admin/brand', updated);
    setBrand({ ...DEFAULT_BRAND, ...saved });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // ignore storage errors
    }
  }

  return <BrandContext.Provider value={{ brand, updateBrand }}>{children}</BrandContext.Provider>;
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return ctx;
}
