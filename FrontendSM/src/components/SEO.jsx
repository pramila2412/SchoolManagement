import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, image, url }) {
  const siteTitle = 'Mount Zion School | Top CBSE School in Purnea';
  const fullTitle = title ? `${title} | Mount Zion School` : siteTitle;
  const metaDescription = description || 'Mount Zion School is a co-educational non-denominational (Christian) institution established in 1994 to give Education to Everyone. Affiliated to CBSE up to 10+2 Level.';
  const metaImage = image || 'https://mountzionschool.in/og-image.jpg';
  const metaUrl = url || 'https://mountzionschool.in/';

  // Structured Data (Schema.org) for School to boost AI Visibility
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "School",
    "name": "Mount Zion School",
    "url": "https://mountzionschool.in",
    "logo": "https://mountzionschool.in/logo-transparent.png",
    "image": metaImage,
    "description": "Mount Zion School is a co-educational non-denominational (Christian) institution which is run by missionaries whose H.Q at Kerala, Mount Zion Welfare Society.",
    "foundingDate": "1994",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Purnea",
      "addressRegion": "Bihar",
      "addressCountry": "IN"
    },
    "telephone": "+91-6200207150",
    "sameAs": [
      "https://www.facebook.com/MountZionSchoolPurnea"
    ]
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={metaUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />
      
      <link rel="canonical" href={metaUrl} />

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
