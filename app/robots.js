export default function robots() {
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/profile', '/favorites'], 
      },
      sitemap: `${BASE_URL}/sitemap.xml`,
    }
  }