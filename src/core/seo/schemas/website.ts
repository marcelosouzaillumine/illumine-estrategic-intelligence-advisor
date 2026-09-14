export function buildWebsiteSchema(lang: string, title: string, description: string) {
  return {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": title,
    "url": "https://illuminegovernance.com",
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://illuminegovernance.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}
