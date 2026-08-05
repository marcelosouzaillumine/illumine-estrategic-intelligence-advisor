export function buildOrganizationSchema(lang: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Illumine Strategic Intelligence",
    "url": "https://illumineintelligence.com",
    "logo": "https://illumineintelligence.com/assets/logo.png",
    "sameAs": [
      "https://www.linkedin.com/company/illumine-intelligence",
      "https://twitter.com/illumine"
    ]
  };
}
