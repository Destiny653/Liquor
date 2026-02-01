export default function sitemap() {
    const baseUrl = 'https://velvetcasks.com';

    const routes = [
        '',
        '/shop',
        '/about',
        '/profile',
        '/policies/privacy-policy',
        '/policies/terms-and-condition-policy',
        '/policies/shipping-policy',
        '/policies/refund-policy',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route.includes('policies') ? 'monthly' : 'daily',
        priority: route === '' ? 1 : route === '/shop' ? 0.8 : 0.5,
    }));
}

