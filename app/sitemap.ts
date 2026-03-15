import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://sh-himanshu.github.io/auto-cut";

    return [
        {
            url: baseUrl,
            lastModified: "2026-03-15",
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${baseUrl}/changelog`,
            lastModified: "2026-03-15",
            changeFrequency: "weekly",
            priority: 0.7,
        },
    ];
}
