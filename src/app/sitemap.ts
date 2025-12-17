import { de } from "date-fns/locale";
import type { Metadata, MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${process.env.NEXT_PUBLIC_URL}`,
            lastModified: new Date(),
            priority: 1,
            changeFrequency: "monthly",
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL}/barbearia/{id}`,
            lastModified: new Date(),
            priority: 0.9,
            changeFrequency: "monthly",
        },
    ];
}