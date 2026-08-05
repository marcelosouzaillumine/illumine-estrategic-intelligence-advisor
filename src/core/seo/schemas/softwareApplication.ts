export function buildSoftwareApplicationSchema(lang: string, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
}
