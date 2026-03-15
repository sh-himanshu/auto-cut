import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://sh-himanshu.github.io/auto-cut";

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${baseUrl}/changelog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
    ];
}
