import { useEffect, useState } from 'react';
import { api } from '../lib/api-client';

interface CMSPageData {
  slug: string;
  title: string;
  body: string;
  status: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface UseCMSPageResult {
  page: CMSPageData | null;
  loading: boolean;
  /** True when the page was fetched successfully and has non-empty body */
  hasContent: boolean;
}

/**
 * Fetches page content from the public CMS API.
 * Returns null (hasContent=false) if the page is not found, not published,
 * or the API is unavailable — callers should render their static fallback instead.
 */
export function useCMSPage(slug: string): UseCMSPageResult {
  const [page, setPage] = useState<CMSPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<CMSPageData>(`/pages/${slug}`)
      .then((data) => {
        if (!cancelled) setPage(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setPage(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  return {
    page,
    loading,
    hasContent: !loading && page !== null && page.body.trim().length > 0,
  };
}
