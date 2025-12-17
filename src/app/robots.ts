import type { Metadata, MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/dashboard/services/",
          "/dashboard/profile/",
          "/dashboard/plans/",
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
