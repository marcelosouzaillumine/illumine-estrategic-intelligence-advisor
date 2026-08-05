import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSeo } from './hooks/useSeo';
import { RouteKey } from '../routing/internationalRoutes';

interface SeoManagerProps {
  pageKey: RouteKey;
  schemaTypes?: ('softwareApplication' | 'organization' | 'website')[];
}

export function SeoManager({ pageKey, schemaTypes }: SeoManagerProps) {
  const seoData = useSeo({ pageKey, schemaTypes });

  // In the future, this is where we will inject JSON-LD schemas
  // based on schemaTypes prop and i18n data.

  return (
    <Helmet>
      <html lang={seoData.currentLang} />
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      
      {/* Canonical */}
      <link rel="canonical" href={seoData.canonicalUrl} />
      
      {/* Hreflang Tags */}
      {seoData.hreflangTags.map((tag) => (
        <link key={tag.hreflang} rel="alternate" hrefLang={tag.hreflang} href={tag.href} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
    </Helmet>
  );
}
