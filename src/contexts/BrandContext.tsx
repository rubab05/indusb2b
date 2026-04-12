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
  reloadBrand: () => Promise<void>;
}

const STORAGE_KEY = 'homatz_brand_config';

export const DEFAULT_BRAND: BrandConfig = {
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

function persistBrand(config: BrandConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore storage errors
  }
}

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig>(loadLocalBrand);

  async function reloadBrand() {
    // Always fetch from the public /api/brand endpoint (no auth required)
    const config = await api.get<BrandConfig>('/brand');
    const merged = { ...DEFAULT_BRAND, ...config };
    setBrand(merged);
    persistBrand(merged);
  }

  useEffect(() => {
    // Load brand on mount for all users (public endpoint)
    reloadBrand().catch(() => {
      // API unavailable — keep local/default brand already in state
    });
  }, []);

  async function updateBrand(config: Partial<BrandConfig>) {
    // updateBrand still writes through the protected admin endpoint
    const updated = { ...brand, ...config };
    const saved = await api.put<BrandConfig>('/admin/brand', updated);
    const merged = { ...DEFAULT_BRAND, ...saved };
    setBrand(merged);
    persistBrand(merged);
  }

  return (
    <BrandContext.Provider value={{ brand, updateBrand, reloadBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return ctx;
}
