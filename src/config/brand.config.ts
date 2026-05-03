const brandName = 'INDUS FORT' as const;

export const brandConfig = {
  brandName,
  logoUrl: '',
  logoSecondaryUrl: '',
  faviconUrl: '',

  // Colours — edit these hex values to retheme the entire platform
  primaryColor: '#1b471d',
  secondaryColor: '#b1a9a9',
  accentColor: '#bf520a',

  // Email / document templates
  emailHeaderHtml:
    `<div style='background:#111827;padding:16px;color:#fff;font-family:sans-serif;letter-spacing:0.1em;'>${brandName}</div>`,
  invoiceHeaderHtml:
    `<div style='font-family:sans-serif;font-size:24px;letter-spacing:0.1em;'>${brandName}</div>`,

  domain: 'indusfort.co.uk'
} as const;

export type BrandConfig = typeof brandConfig;
