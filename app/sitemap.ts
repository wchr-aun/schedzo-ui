import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://schedzo.app/", changeFrequency: "monthly", priority: 1 },
    {
      url: "https://schedzo.app/schedule-monzo-savings-pot-withdrawals",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
